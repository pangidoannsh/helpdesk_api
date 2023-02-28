import { Injectable } from '@nestjs/common';
import { Ticket } from 'src/entity';
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
@Injectable()
export class TicketService {
    constructor(
        @InjectRepository(Ticket)
        private ticketRepository: Repository<Ticket>
    ) { }

    index() {
        return this.ticketRepository.find();
    }
}
