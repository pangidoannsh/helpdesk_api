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
        const result = await this.ticketMessageRepo.findBy({ ticket: { id: ticketId } })
        // createQueryBuilder('message')
        // .leftJoinAndSelect('message.userCreated', 'user')
        // .select(['message.id', "message.ticketId", 'message.content', 'message.createdAt', 'user.id', 'user.name', 'user.level'])
        // .where("message.ticketId = :ticketId", { ticketId })
        // .getMany();

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

    async store(content: string, ticketId: number, user: any, quote?: string) {
        const createMessage = this.ticketMessageRepo.create({
            content, ticket: { id: ticketId },
            userCreated: { id: user.id },
            quote
        })
        const saveTicket = await this.ticketMessageRepo.save(createMessage);
        const newTicket = await this.ticketMessageRepo.findOneBy({ id: saveTicket.id })
        // .createQueryBuilder('message')
        //     .leftJoinAndSelect('message.userCreated', 'user')
        //     .select(['message.id', "message.ticketId", 'message.content', 'message.createdAt', 'user.id', 'user.name', 'user.level'])
        //     .where("message.id = :id", { id: saveTicket.id })
        //     .getOne()

        const { createdAt } = newTicket;
        if (createdAt) {
            const { date, time } = displayDate(createdAt);
            return { ...newTicket, createdAt: date + ' ' + time }
        }

        return newTicket
    }
}
