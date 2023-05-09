import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { ConfigurationModule } from '../configuration/configuration.module';
import { AgentScheduleService } from './agent-schedule.service';
import { TimeScheduleModule } from '../time-schedule/time-schedule.module';
import { FungsiScheduleModule } from '../fungsi-schedule/fungsi-schedule.module';
import { NotificationService } from './notification.service';

@Module({
  imports: [ConfigurationModule, TimeScheduleModule, FungsiScheduleModule],
  providers: [WhatsappService, AgentScheduleService, NotificationService],
  exports: [NotificationService]
})
export class NotificationModule { }
