import { HttpException, Injectable } from '@nestjs/common';
import { Ticket } from 'src/entity';
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, SelectQueryBuilder } from "typeorm"
import { CreateTicketDTO, EditTicketDTO, TicketFilterDTO } from './ticket.dto';
import { TicketMessageService } from '../ticket-message/ticket-message.service';
import { displayDate, getExpiredDate } from 'src/utils/date';
import { NotificationService } from '../notification/notification.service';
import { ConfigurationService } from '../configuration/configuration.service';

@Injectable()
export class TicketService {

    constructor(
        @InjectRepository(Ticket)
        private readonly ticketRepository: Repository<Ticket>,
        private readonly messageService: TicketMessageService,
        private readonly notification: NotificationService,
        private readonly config: ConfigurationService
    ) { }

    /**
     * berfungsi untuk filtrasi data ticket
     * @param queryBuilder 
     * @param filter : berupa object => {subject,category,fungsi,priority,status}
     * @returns 
     */
    filterQuery(queryBuilder: SelectQueryBuilder<Ticket>, filter: TicketFilterDTO)
        : SelectQueryBuilder<Ticket> {
        const { subject, category, fungsi, priority, status } = filter;

        if (subject) queryBuilder.andWhere('ticket.subject Like :subject', { subject: `%${subject}%` })
        if (priority) queryBuilder.andWhere('ticket.priority = :priority', { priority });
        if (status) queryBuilder.andWhere('ticket.status = :status', { status });
        if (category) queryBuilder.andWhere('ticket.categoryId = :category', { category });
        if (fungsi) queryBuilder.andWhere('ticket.fungsi = :fungsi', { fungsi });

        return queryBuilder;
    }

    /**
     * berfungsi untuk mengecek expired ticket dan mengubah status ticket yang sudah lewat batas expired dari open ke expired
     * @param allData 
     * @param orderByStatus : menentukan apakah data yang sudah di-update statusnya akan di diurutkan berdasarkan status?
     * @returns 
     */
    async checkExpirated(allData: Ticket[], orderByStatus?: boolean) {
        const currentDate = new Date();
        const result = await Promise.all(
            allData.map(data => {
                // logic : jika status tiket sama dengan "open" dan sekarang sudah melebihi batas waktu expired 
                //         maka update status ke "expired"
                if (data.status === "open" && data.expiredAt < currentDate) {
                    return this.updateStatus(data.id, { status: "expired" });
                }
                return data;
            })
        );
        const enumStatus = ["open", "process", "done", "expired"];

        if (orderByStatus) result.sort((a, b) => enumStatus.indexOf(a.status) - enumStatus.indexOf(b.status));
        return result;
    };

    /**
     * berfungsi untuk mengambil panjang data dari semua data ticket
     * @param filter 
     * @returns 
     */
    async getLengthAll(filter: TicketFilterDTO) {
        // const { subject, category, fungsi, priority, status } = filter;

        const queryBuilder = this.ticketRepository.createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.userOrderer', 'user')
            .leftJoinAndSelect('ticket.category', 'category')

        // if (subject) queryBuilder.andWhere('ticket.subject Like :subject', { subject: `%${subject}%` })
        // if (priority) queryBuilder.andWhere('ticket.priority = :priority', { priority });
        // if (status) queryBuilder.andWhere('ticket.status = :status', { status });
        // if (category) queryBuilder.andWhere('ticket.categoryId = :category', { category });
        // if (fungsi) queryBuilder.andWhere('ticket.fungsi = :fungsi', { fungsi });

        const lengthData = await this.filterQuery(queryBuilder, filter).orderBy('ticket.createdAt', 'DESC').getCount();
        return lengthData;
    }

    async all(filter?: TicketFilterDTO) {
        const { subject, category, fungsi, priority, status } = filter;
        const queryBuilder = this.ticketRepository.createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.userOrderer', 'user')
            .leftJoinAndSelect('ticket.category', 'category')
            .leftJoinAndSelect('ticket.fungsi', 'fungsi')

        const allData = await this.filterQuery(queryBuilder, filter).orderBy('ticket.createdAt', 'DESC').getMany();

        return await this.checkExpirated(allData);
    }

    /**
     * fungsi untuk mengambil seluruh data ticket dengan request berasal dari dashboard 
     * NOTE : data diambil sebagian berdasarkan pagination
     * @param filter 
     * @returns 
     */
    async getByDashboard(filter?: TicketFilterDTO) {
        const { subject, category, fungsi, priority, status, limit, offset } = filter;
        const queryBuilder = this.ticketRepository.createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.userOrderer', 'user')
            .leftJoinAndSelect('ticket.category', 'category')
            .leftJoinAndSelect('ticket.fungsi', 'fungsi')

        this.filterQuery(queryBuilder, filter).orderBy('ticket.status', 'ASC').addOrderBy('ticket.createdAt', 'DESC')

        if (offset) queryBuilder.offset(offset);
        if (limit) queryBuilder.limit(limit);

        const allData = await queryBuilder.getMany();

        return await this.checkExpirated(allData);
    }

    /**
     * mengambil data ticket yang dibuat oleh user yang me-rquest data
     * @param user 
     * @param filter 
     * @returns 
     */
    async getByUser(user: any, filter: TicketFilterDTO) {
        const { subject, category, fungsi, priority, status, offset, limit } = filter;

        const userId = user.id;
        const queryBuilder: SelectQueryBuilder<Ticket> = this.ticketRepository.createQueryBuilder('ticket')
            .where('ticket.userOrdererId = :userId', { userId })
            .leftJoinAndSelect('ticket.category', 'category')
            .leftJoinAndSelect('ticket.fungsi', 'fungsi')

        this.filterQuery(queryBuilder, filter).orderBy('ticket.status', 'ASC').addOrderBy('ticket.createdAt', 'DESC');

        // pagination query
        if (offset) queryBuilder.offset(offset);
        if (limit) queryBuilder.limit(limit)

        // get data
        const allData = await queryBuilder.getMany();

        return await this.checkExpirated(allData, true);
    }

    /**
     * mengambil 1 data ticket
     * @param id 
     * @returns 
     */
    async getOneById(id: string) {

        const getOne = await this.ticketRepository.findOne({
            where: { id },
            relations: ['userOrderer', 'fungsi']
        });
        if (getOne) {
            const { date, time } = displayDate(getOne.createdAt);
            const { date: expiredDate, time: expiredTime } = displayDate(getOne.expiredAt ?? null);
            return { ...getOne, createdAt: date + ' ' + time, expiredAt: expiredDate + ' ' + expiredTime };
        } else {
            return getOne;
        }

    }

    /**
     * membuat ticket baru
     * @param payload 
     * @param user 
     * @returns 
     */
    async store(payload: CreateTicketDTO, user: any) {
        const { subject, category, priority, fungsiId, message } = payload;
        const getTicketExpired = this.config.config.ticketDeadline;

        const createTicket = this.ticketRepository.create({
            subject: subject,
            category: { id: category },
            userOrderer: { id: user.id },
            priority: priority,
            fungsi: { id: fungsiId },
            expiredAt: getExpiredDate(getTicketExpired)
        });
        const messageBuilder = "*HELPDESK IT*\n\n" +
            "Laporan Baru!\n" +
            `dari\t\t\t: ${user.name} (${user.fungsi?.name ?? 'undifined'})\n` +
            `Subjek\t\t: ${subject}\n` +
            `Keterangan\t: ${message}\n\n` +
            "Mohon Segera Diproses!"

        // Send Notification
        this.notification.sendMessageToAgent(fungsiId, messageBuilder);
        if (createTicket) {
            const newTicket = await this.ticketRepository.save(createTicket);
            const createMessage = this.messageService.store(payload.message, newTicket.id, user);
            return newTicket;
        }
    }


    async updateStatus(id: string, { status, expiredAt }: Partial<EditTicketDTO>) {

        await this.ticketRepository.update({ id }, {
            status,
            expiredAt
        })
        const result = this.ticketRepository.findOne({
            where: { id },
            relations: ["userOrderer", "fungsi"]
        });
        return await result;
    }

    /**
     * untuk menghapus data ticket
     * @param id 
     * @returns 
     */
    async deleteData(id: any) {
        try {
            return await this.ticketRepository.delete({ id })
        } catch (e) {
            throw new HttpException("Tidak dapat menghapus ticket ini!",
                406, { cause: new Error(e) })
        }
    }
    /**
     * Update status ticket ke PROCESS
     * @param id 
     */
    async processTicket(id: string) {
        await this.ticketRepository.update({ id }, {
            status: 'process'
        })

        return await this.ticketRepository.findOne({
            where: { id },
            relations: ["userOrderer", "fungsi"]
        });;
    }
}
