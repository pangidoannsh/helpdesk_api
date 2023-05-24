import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { ConfigurationModule } from '../configuration/configuration.module';
import { NotificationService } from './notification.service';
import { ScheduleModule } from '../schedule/schedule.module';

@Module({
  imports: [ScheduleModule, ConfigurationModule],
  providers: [WhatsappService, NotificationService],
  exports: [NotificationService]
})
export class NotificationModule { }
