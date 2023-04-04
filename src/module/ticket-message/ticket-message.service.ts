import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketMessage } from 'src/entity';
import { displayDate } from 'src/utils/date';
import { Repository } from 'typeorm';

@Injectable()
export class TicketMessageService {
    constructor(
        @InjectRepository(TicketMessage)
        private ticketMessageRepo: Repository<TicketMessage>
    ) { }

    async allByTicket(ticketId: any) {
        const result = await this.ticketMessageRepo.createQueryBuilder('message')
            .leftJoinAndSelect('message.userCreated', 'user')
            .select(['message.id', 'message.content', 'message.createdAt', 'user.id', 'user.name', 'user.level'])
            .where("message.ticketId = :ticketId", { ticketId })
            .getMany();

        const messageData = result.map((data: any) => {
            const { createdAt } = data;

            if (createdAt) {
                const { date, time } = displayDate(createdAt);
                return { ...data, createdAt: date + ' ' + time }
            }
            return data
        })
        return messageData;
    }

    async store(content: string, ticketId: string, user: any, quote?: string) {
        const createMessage = this.ticketMessageRepo.create({
            content, ticket: { id: ticketId },
            userCreated: { id: user.id },
            quote
        })
        const newTicket = await this.ticketMessageRepo.save(createMessage);
        const { createdAt } = newTicket;
        if (createdAt) {
            const { date, time } = displayDate(createdAt);
            return { ...newTicket, createdAt: date + ' ' + time }
        }
        return newTicket
    }
}
