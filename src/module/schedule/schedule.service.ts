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
        const baseSchedule = this.configService.config.BaseScheduleAgent;
        const fungsiSchedule = await this.fungsiSchedule.getSchedule();
        const timeSchedule = await this.timeSchedule.getFromThisMonth();

        return { base: baseSchedule, timeSchedule, fungsiSchedule }
    }

    async getAgentAssignment(fungsiId: number) {
        try {
            const baseSchedule = this.configService.config?.BaseScheduleAgent ?? (await this.configService.getConfig()).BaseScheduleAgent;
            if (baseSchedule === 'fungsi') {
                return await this.fungsiSchedule.getScheduleByFungsi(fungsiId)
            } else {
                return await this.timeSchedule.getTodaySchedule();
            }
        } catch (e) {
            throw new BadGatewayException(e);
        }
    }

    async getPhoneDutyAgent(fungsiId: number) {
        const baseSchedule = this.configService.config.BaseScheduleAgent;
        const agentAssignment = await this.getAgentAssignment(fungsiId);

        const agentNumbers = [];
        agentAssignment.forEach((schedule: any) => {
            agentNumbers.push(schedule.agentUser.phone);
        })
        return { baseSchedule, agentNumbers };
    }

    async getAssignAgentId(fungsiId: number) {
        const agentAssignment = await this.getAgentAssignment(fungsiId);
        return agentAssignment
            .map((schedule: any) => schedule.agentUser.id)
    }
}
