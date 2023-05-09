import { BadGatewayException, Injectable } from '@nestjs/common';
import { FungsiScheduleService } from '../fungsi-schedule/fungsi-schedule.service';
import { TimeScheduleService } from '../time-schedule/time-schedule.service';
import { ConfigurationService } from '../configuration/configuration.service';

@Injectable()
export class ScheduleService {
    constructor(
        private readonly configService: ConfigurationService,
        private readonly fungsiSchedule: FungsiScheduleService,
        private readonly timeSchedule: TimeScheduleService
    ) { }

    async getDataSchedule() {
        const baseSchedule = await this.configService.getBaseSchedule();
        const fungsiSchedule = await this.fungsiSchedule.getSchedule();
        const timeSchedule = await this.timeSchedule.getFromThisMonth();

        return { base: baseSchedule, timeSchedule, fungsiSchedule }
    }
}
