import { Controller, Get, Post, Put, Req, Body, Query, UseGuards, UsePipes, ValidationPipe, Param } from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDTO, FaqQueryDTO } from './faq.dto';
import { JwtGuard } from 'src/guard/jwt.guard';
import { LevelGuard } from 'src/guard/level.guard';

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
    @UsePipes(ValidationPipe)
    @UseGuards(JwtGuard, new LevelGuard('supervisor', 'agent'))
    async createFaq(@Req() req: any, @Body() payload: CreateFaqDTO) {
        const { subject, description } = payload;
        const userCreateId = req.user.id

        return await this.faqService.store(subject, description, userCreateId);
    }

    @Put(':id')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtGuard, new LevelGuard('supervisor', 'agent'))
    async updateFaq(@Req() req: any, @Body() payload: CreateFaqDTO, @Param('id') id: any) {
        const { subject, description } = payload;
        const userUpdateId = req.user.id

        return await this.faqService.update(id, subject, description, userUpdateId)
    }
}
