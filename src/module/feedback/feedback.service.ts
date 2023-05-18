import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from 'src/entity';
import { Repository } from 'typeorm';
import { CreateFeeadbackDTO } from './feedback.dto';
import { TicketService } from '../ticket/ticket.service';

@Injectable()
export class FeedbackService {
    constructor(
        @InjectRepository(Feedback)
        private feedbackRepo: Repository<Feedback>,
        private readonly ticketService: TicketService
    ) { }

    async getFeedbackCountEachValue() {
        const countFeedback = await this.feedbackRepo.createQueryBuilder('feedback')
            .select('feedback.value as value, COUNT(*) as count')
            .groupBy('feedback.value')
            .getRawMany();
        return countFeedback.filter(data => data.value !== 0).map(feedback => {
            let label = '';
            switch (feedback.value) {
                case 1:
                    label = 'Tidak Puas'
                    break;
                case 2:
                    label = 'Puas'
                    break;
                case 3:
                    label = 'Sangat Puas'
                    break;
            }

            return { value: feedback.value, label, count: feedback.count }
        })
    }
    async findByTicket(ticketId: string) {
        const result = await this.feedbackRepo.createQueryBuilder('feedback')
            .where("feedback.ticket = :ticketId", { ticketId }).getMany();
        return result;
    }

    async store(data: CreateFeeadbackDTO, user: any) {
        const { comment, value, ticketId } = data
        const newFeedback = this.feedbackRepo.create({
            comment, value, ticket: { id: ticketId }, userCreate: { id: user.id }
        });
        if (newFeedback) {
            await this.ticketService.updateStatus(ticketId, 'done')
        }
        return this.feedbackRepo.save(newFeedback)
    }
}
