import { Controller, Get, Post, Req, Res, Param, UseGuards, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { JwtGuard } from 'src/guard/jwt.guard';
import { LevelGuard } from 'src/guard/level.guard';
import { CreateFeeadbackDTO } from './feedback.dto';
import { Request } from 'express';

@Controller('feedback')
export class FeedbackController {
    constructor(
        private readonly feedbackService: FeedbackService
    ) { }

    @Get('count')
    async getFeedbackCountEachValue() {
        return this.feedbackService.getFeedbackCountEachValue();
    }
    @Get(':ticket')
    async show(@Param('ticket') ticket: string) {
        return this.feedbackService.findByTicket(ticket);
    }

    @Post()
    @UsePipes(ValidationPipe)
    @UseGuards(JwtGuard, new LevelGuard('pegawai'))
    async createFeedback(@Req() req: Request, @Body() payload: CreateFeeadbackDTO) {
        return await this.feedbackService.store(payload, req.user)
    }
}

