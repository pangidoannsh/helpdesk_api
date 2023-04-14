import { Controller, Get, Post, Put, Req, Body, Query } from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDTO, FaqQueryDTO } from './faq.dto';

@Controller('faq')
export class FaqController {
    constructor(
        private readonly faqService: FaqService
    ) { }

    @Get()
    async getAllFaq(@Query() query: FaqQueryDTO) {
        const { subject } = query;

        return await this.faqService.getAll(subject);
    }

    @Post()
    async createFaq(@Req() req: any, @Body() payload: CreateFaqDTO) {
        const { subject, description } = payload;
        const userCreateId = req.user.id

        return await this.faqService.store(subject, description, userCreateId);
    }
}
