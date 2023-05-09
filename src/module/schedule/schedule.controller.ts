import { Controller, Get } from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
    constructor(
        private readonly scheduleService: ScheduleService
    ) { }

    @Get()
    async getSchedule() {
        return this.scheduleService.getDataSchedule()
    }
}
