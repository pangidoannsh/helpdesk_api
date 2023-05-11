import { Injectable } from "@nestjs/common";
import { AgentScheduleService } from "./agent-schedule.service";
import { WhatsappService } from "./whatsapp.service";
import { ConfigurationService } from "../configuration/configuration.service";

@Injectable()
export class NotificationService {
    constructor(
        private readonly agentSchedule: AgentScheduleService,
        private readonly whatsApp: WhatsappService,
        private readonly config: ConfigurationService
    ) { }

    async sendMessageToAgent(fungsiId: number, message: string) {
        const isSendWhatsapp = this.config.config.isSendWhatsapp ?? (await this.config.getConfig()).BaseScheduleAgent
        if (isSendWhatsapp) {
            const { baseSchedule, agentNumbers } = await this.agentSchedule.getPhoneDutyAgent(fungsiId);

            agentNumbers.forEach(phone => {
                this.whatsApp.send(phone, message)
            });
        }
    }
}