import { Controller, Get, Post, ValidationPipe, UseGuards, UsePipes, Body, Req, Delete, Param, Query } from '@nestjs/common';
import { TimeScheduleService } from './time-schedule.service';
import { Request } from 'express';
import { AddAgentOnSchedule, QueryGetSchedule } from './time-schedule.dto';
import { JwtGuard } from 'src/guard/jwt.guard';
import { LevelGuard } from 'src/guard/level.guard';

@Controller('time-schedule')
export class TimeScheduleController {
    constructor(
        private readonly scheduleService: TimeScheduleService
    ) { }
    // @Get('today')
    // async today() {
    //     return this.scheduleService.getTodaySchedule();
    // }
    @Get()
    @UseGuards(JwtGuard)
    async getAllSchedule(@Query() query: QueryGetSchedule) {
        // console.log(query);

        return await this.scheduleService.getFromThisMonth(query);
    }

    @Post()
    @UseGuards(JwtGuard, new LevelGuard('supervisor'))
    @UsePipes(ValidationPipe)
    async addAgent(@Req() req: Request, @Body() payload: AddAgentOnSchedule) {
        return await this.scheduleService.storeAgent(payload.agentId, payload.dutyTime);
    }

    @Delete(':id')
    @UseGuards(JwtGuard, new LevelGuard('supervisor'))
    async deleteSchedule(@Param('id') id: any) {
        return this.scheduleService.deleteSchedule(id);
    }
}
