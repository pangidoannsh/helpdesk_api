import { Injectable } from "@nestjs/common";
import { AgentScheduleService } from "./agent-schedule.service";
import { WhatsappService } from "./whatsapp.service";

@Injectable()
export class NotificationService {
    constructor(
        private readonly agentSchedule: AgentScheduleService,
        private readonly whatsApp: WhatsappService
    ) { }

    async sendMessageToAgent(fungsiId: number, message: string) {
        const { baseSchedule, agentNumbers } = await this.agentSchedule.getPhoneDutyAgent(fungsiId);

        agentNumbers.forEach(phone => {
            this.whatsApp.send(phone, message)
        });
    }
}