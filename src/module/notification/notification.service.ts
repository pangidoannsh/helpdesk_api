import { BadGatewayException, Injectable } from "@nestjs/common";
import { WhatsappService } from "./whatsapp.service";
import { ConfigurationService } from "../configuration/configuration.service";
import { ScheduleService } from "../schedule/schedule.service";

@Injectable()
export class NotificationService {
    constructor(
        private readonly schedule: ScheduleService,
        private readonly whatsApp: WhatsappService,
        private readonly config: ConfigurationService
    ) { }

    async sendMessageToAgent(fungsiId: number, message: string) {
        try {
            const isSendWhatsapp = this.config.config.isSendWhatsapp ?? (await this.config.getConfig()).BaseScheduleAgent
            if (isSendWhatsapp) {
                const { baseSchedule, agentNumbers } = await this.schedule.getPhoneDutyAgent(fungsiId);
                // console.log(agentNumbers);

                agentNumbers.forEach(async phone => {
                    await this.whatsApp.send(phone, message)
                });
            }
        } catch (e) {
            throw new BadGatewayException(e)
        }
    }
    async sendMessageToTicketOrderer(phone: string, message: string) {
        const isSendWhatsapp = this.config.config.isSendWhatsapp ?? (await this.config.getConfig()).BaseScheduleAgent
        if (isSendWhatsapp) {
            this.whatsApp.send(phone, message)
        }
    }
}