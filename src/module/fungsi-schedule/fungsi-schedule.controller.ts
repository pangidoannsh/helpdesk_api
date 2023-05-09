import { Controller, Get, Post, Query, Body, UseGuards, UsePipes, ValidationPipe, Delete, Param } from '@nestjs/common';
import { FungsiScheduleService } from './fungsi-schedule.service';
import { CreateFungsiScheduleDTO, QueryFungsiScheduleDTO } from './fungsi-schedule.dto';
import { JwtGuard } from 'src/guard/jwt.guard';
import { LevelGuard } from 'src/guard/level.guard';

@Controller('fungsi-schedule')
export class FungsiScheduleController {
    constructor(
        private readonly scheduleService: FungsiScheduleService
    ) { }

    // @Get('test')
    // async test(@Body('fungsiId') fungsiId: number) {
    //     return await this.scheduleService.getScheduleByFungsi(fungsiId);
    // }
    @Get()
    @UseGuards(JwtGuard, new LevelGuard('supervisor'))
    getAll(@Query() query: QueryFungsiScheduleDTO) {
        return this.scheduleService.getSchedule();
    }

    @Post()
    @UseGuards(JwtGuard, new LevelGuard('supervisor'))
    @UsePipes(ValidationPipe)
    async createAgentSchedule(@Body() payload: CreateFungsiScheduleDTO) {
        const { agentId, fungsiId } = payload;
        return await this.scheduleService.storeData(fungsiId, agentId);
    }

    @Delete(':id')
    @UseGuards(JwtGuard, new LevelGuard('supervisor'))
    async deleteSchedule(@Param('id') id: any) {
        return this.scheduleService.deleteData(id);
    }

}
