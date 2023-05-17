import { Injectable, NotAcceptableException } from '@nestjs/common';
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

    async checkExpirated(allData: Ticket[], orderByStatus?: boolean) {
        const currentDate = new Date();
        const result = await Promise.all(
            allData.map(data => {
                if (data.status !== "expired" && data.expiredAt < currentDate) {
                    return this.updateStatus(data.id, { status: "expired" });
                }
                return data;
            })
        );
        const enumStatus = ["open", "process", "done", "expired"];

        if (orderByStatus) result.sort((a, b) => enumStatus.indexOf(a.status) - enumStatus.indexOf(b.status));
        return result;
    };

    async getLengthAll(filter: TicketFilterDTO) {
        const { subject, category, fungsi, priority, status } = filter;

        const queryBuilder = this.ticketRepository.createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.userOrderer', 'user')
            .leftJoinAndSelect('ticket.category', 'category')

        if (subject) queryBuilder.andWhere('ticket.subject Like :subject', { subject: `%${subject}%` })
        if (priority) queryBuilder.andWhere('ticket.priority = :priority', { priority });
        if (status) queryBuilder.andWhere('ticket.status = :status', { status });
        if (category) queryBuilder.andWhere('ticket.categoryId = :category', { category });
        if (fungsi) queryBuilder.andWhere('ticket.fungsi = :fungsi', { fungsi });

        const lengthData = await queryBuilder.orderBy('ticket.createdAt', 'DESC').getCount();
        return lengthData;
    }

    async all(filter?: TicketFilterDTO) {
        const { subject, category, fungsi, priority, status } = filter;
        const queryBuilder = this.ticketRepository.createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.userOrderer', 'user')
            .leftJoinAndSelect('ticket.category', 'category')
            .leftJoinAndSelect('ticket.fungsi', 'fungsi')

        if (subject) queryBuilder.andWhere('ticket.subject Like :subject', { subject: `%${subject}%` })
        if (priority) queryBuilder.andWhere('ticket.priority = :priority', { priority });
        if (status) queryBuilder.andWhere('ticket.status = :status', { status });
        if (category) queryBuilder.andWhere('ticket.categoryId = :category', { category });
        if (fungsi) queryBuilder.andWhere('ticket.fungsi = :fungsi', { fungsi });

        const allData = await queryBuilder.orderBy('ticket.createdAt', 'DESC').getMany();

        return await this.checkExpirated(allData);
    }

    async getByDashboard(filter?: TicketFilterDTO) {
        const { subject, category, fungsi, priority, status, limit, offset } = filter;
        const queryBuilder = this.ticketRepository.createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.userOrderer', 'user')
            .leftJoinAndSelect('ticket.category', 'category')
            .leftJoinAndSelect('ticket.fungsi', 'fungsi')

        if (subject) queryBuilder.andWhere('ticket.subject Like :subject', { subject: `%${subject}%` })
        if (priority) queryBuilder.andWhere('ticket.priority = :priority', { priority });
        if (status) queryBuilder.andWhere('ticket.status = :status', { status });
        if (category) queryBuilder.andWhere('ticket.categoryId = :category', { category });
        if (fungsi) queryBuilder.andWhere('ticket.fungsi = :fungsi', { fungsi });

        queryBuilder.orderBy('ticket.status', 'ASC').addOrderBy('ticket.createdAt', 'DESC')

        if (offset) queryBuilder.offset(offset);
        if (limit) queryBuilder.limit(limit);

        const allData = await queryBuilder.getMany();

        return await this.checkExpirated(allData);
    }

    async getByUser(user: any, filter: TicketFilterDTO) {
        const { subject, category, fungsi, priority, status, offset, limit } = filter;

        const userId = user.id;
        const queryBuilder: SelectQueryBuilder<Ticket> = this.ticketRepository.createQueryBuilder('ticket')
            .where('ticket.userOrdererId = :userId', { userId })
            .leftJoinAndSelect('ticket.category', 'category')
            .leftJoinAndSelect('ticket.fungsi', 'fungsi')

        // filter query
        if (subject) queryBuilder.andWhere('ticket.subject Like :subject', { subject: `%${subject}%` })
        if (priority) queryBuilder.andWhere('ticket.priority = :priority', { priority });
        if (status) queryBuilder.andWhere('ticket.status = :status', { status });
        if (category) queryBuilder.andWhere('ticket.categoryId = :category', { category });

        queryBuilder.orderBy('ticket.status', 'ASC').addOrderBy('ticket.createdAt', 'DESC');

        // pagination query
        if (offset) queryBuilder.offset(offset);
        if (limit) queryBuilder.limit(limit)

        // get data
        const allData = await queryBuilder.getMany();

        return await this.checkExpirated(allData, true);
    }

    async getOneById(id: string) {

        const getOne = await this.ticketRepository.findOne({
            where: { id },
            relations: ['userOrderer']
        });
        if (getOne) {
            const { date, time } = displayDate(getOne.createdAt);
            const { date: expiredDate, time: expiredTime } = displayDate(getOne.expiredAt ?? null);
            return { ...getOne, createdAt: date + ' ' + time, expiredAt: expiredDate + ' ' + expiredTime };
        } else {
            return getOne;
        }

    }

    async store(payload: CreateTicketDTO, user: any) {
        const { subject, category, priority, fungsiId, message } = payload;
        if(fungsiId === -1){
            throw new NotAcceptableException('User Belum Memiliki Fungsi, Silahkan atur fungsi dari user terlebih dahulu')
        }
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
            relations: ["userOrderer"]
        });
        return await result;
    }
}
