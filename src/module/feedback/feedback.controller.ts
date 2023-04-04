import { Controller, Get, Post, Req, Res, Param } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
    constructor(
        private readonly feedbackService: FeedbackService
    ) { }
    @Get(':ticket')
    async show(@Param('ticket') ticket: string) {
        return this.feedbackService.findByTicket(ticket);
    }
}

