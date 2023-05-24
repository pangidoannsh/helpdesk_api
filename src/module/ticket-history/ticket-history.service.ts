import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketHistory } from 'src/entity';
import { Repository } from 'typeorm';

@Injectable()
export class TicketHistoryService {
    constructor(
        @InjectRepository(TicketHistory)
        private readonly history: Repository<TicketHistory>
    ) { }

    async getByTicketId(ticketId: any) {
        return await this.history.findBy({ ticket: { id: ticketId } })
    }

    createHistory(ticketId: any, status: string, userCreatedId: any) {
        const createHistory = this.history.create({
            ticket: { id: ticketId }, userCreated: { id: userCreatedId }, status
        })
        this.history.save(createHistory)
    }

}
