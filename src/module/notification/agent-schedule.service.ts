import { Injectable } from "@nestjs/common"
import { ConfigurationService } from "../configuration/configuration.service";
import { TimeScheduleService } from "../time-schedule/time-schedule.service";
import { FungsiScheduleService } from "../fungsi-schedule/fungsi-schedule.service";
import { FungsiSchedule, TimeSchedule } from "src/entity";

@Injectable()
export class AgentScheduleService {
    constructor(
        private readonly configService: ConfigurationService,
        private readonly timeScheduleService: TimeScheduleService,
        private readonly fungsiScheduleService: FungsiScheduleService
    ) { }

    async getPhoneDutyAgent(fungsiId: number) {
        const baseSchedule = await this.configService.getBaseSchedule();
        let getSchedule: Array<FungsiSchedule | TimeSchedule>;
        if (baseSchedule === 'fungsi') {
            getSchedule = await this.fungsiScheduleService.getScheduleByFungsi(fungsiId)
        } else {
            getSchedule = await this.timeScheduleService.getTodaySchedule();
        }
        const agentNumbers = [];
        getSchedule.forEach(schedule => {
            agentNumbers.push(schedule.agentUser.phone);
        })
        return { baseSchedule, agentNumbers };
    }
}