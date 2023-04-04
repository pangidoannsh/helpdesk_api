import { Injectable } from '@nestjs/common';
import { Ticket } from 'src/entity';
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, SelectQueryBuilder } from "typeorm"
import { CreateTicketDTO, EditStatusTicketDTO, TicketFilterDTO } from './ticket.dto';
import { TicketMessageService } from '../ticket-message/ticket-message.service';
import { displayDate, displayDateFromArrayObject, getExpiredDate } from 'src/utils/date';

@Injectable()
export class TicketService {
    constructor(
        @InjectRepository(Ticket)
        private readonly ticketRepository: Repository<Ticket>,
        private readonly messageService: TicketMessageService
    ) { }

    async all(filter?: TicketFilterDTO) {
        const { subject, category, fungsi, priority, status } = filter;
        const queryBuilder = this.ticketRepository.createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.userOrderer', 'user')
            .leftJoinAndSelect('ticket.category', 'category')

        if (subject) queryBuilder.andWhere('ticket.subject Like :subject', { subject: `%${subject}%` })
        if (priority) queryBuilder.andWhere('ticket.priority = :priority', { priority });
        if (status) queryBuilder.andWhere('ticket.status = :status', { status });
        if (category) queryBuilder.andWhere('ticket.categoryId = :category', { category });
        if (fungsi) queryBuilder.andWhere('ticket.fungsi = :fungsi', { fungsi });

        const allData = await queryBuilder.orderBy('ticket.createdAt', 'DESC').getMany();
        const currentDate = new Date();
        const checkExpiratingData = allData.map(data => {
            if (data.status !== "expired" && data.expiredAt < currentDate) {
                return this.updateStatus(data.id, { status: "expired" });
            }
            return data;
        });
        return displayDateFromArrayObject(checkExpiratingData, 'createdAt');
    }

    async getByUser(user: any, filter: TicketFilterDTO) {
        const { subject, category, fungsi, priority, status } = filter;

        const userId = user.id;
        const queryBuilder: SelectQueryBuilder<Ticket> = this.ticketRepository.createQueryBuilder('ticket')
            .where('ticket.userOrdererId = :userId', { userId })
            .leftJoinAndSelect('ticket.category', 'category')

        // query
        if (subject) queryBuilder.andWhere('ticket.subject Like :subject', { subject: `%${subject}%` })
        if (priority) queryBuilder.andWhere('ticket.priority = :priority', { priority });
        if (status) queryBuilder.andWhere('ticket.status = :status', { status });
        if (category) queryBuilder.andWhere('ticket.categoryId = :category', { category });
        if (fungsi) queryBuilder.andWhere('ticket.fungsi = :fungsi', { fungsi });

        const allData = await queryBuilder.orderBy('ticket.createdAt', 'DESC').getMany();
        // const currentDate = new Date();
        // const checkExpiratingData = allData.map(data => {
        //     if (data.status !== "expired" && data.expiredAt < currentDate) {
        //         return this.updateStatus(data.id, { status: "expired" });
        //     }
        //     return data;
        // })
        const result = allData.map((data: any) => {
            const { createdAt } = data;

            if (createdAt) {
                const { date, time } = displayDate(createdAt);
                return { ...data, createdAt: date + ' ' + time }
            }
            return data
        })
        return result;
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
        const createTicket = this.ticketRepository.create({
            subject: payload.subject,
            category: { id: payload.category },
            userOrderer: { id: user.id },
            priority: payload.priority,
            fungsi: payload.fungsi,
            expiredAt: getExpiredDate(4)
        });
        if (createTicket) {
            const newTicket = await this.ticketRepository.save(createTicket);
            const createMessage = this.messageService.store(payload.message, newTicket.id, user);
            return newTicket;
        }
    }

    async updateStatus(id: string, { status }: Partial<EditStatusTicketDTO>) {
        await this.ticketRepository.update({ id }, {
            status
        })
        const result = this.ticketRepository.findOne({
            where: { id },
            relations: ["userOrderer"]
        });
        return result;
    }
}
