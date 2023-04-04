import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from 'src/entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeedbackService {
    constructor(
        @InjectRepository(Feedback)
        private feedbackRepo: Repository<Feedback>
    ) { }

    async findByTicket(ticketId: string) {
        const result = await this.feedbackRepo.createQueryBuilder('feedback')
            .where("feedback.ticket = :ticketId", { ticketId }).getMany();
        return result;
    }
}
