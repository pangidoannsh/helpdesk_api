import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { FungsiScheduleModule } from '../fungsi-schedule/fungsi-schedule.module';
import { TimeScheduleModule } from '../time-schedule/time-schedule.module';
import { ConfigurationModule } from '../configuration/configuration.module';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [FungsiScheduleModule, TimeScheduleModule, ConfigurationModule],
  controllers: [ScheduleController],
  providers: [ScheduleService]
})
export class ScheduleModule { }
