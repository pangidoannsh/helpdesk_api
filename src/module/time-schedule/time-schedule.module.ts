import { Module } from '@nestjs/common';
import { TimeScheduleService } from './time-schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSchedule } from 'src/entity';
import { TimeScheduleController } from './time-schedule.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TimeSchedule])],
  providers: [TimeScheduleService],
  controllers: [TimeScheduleController],
  exports: [TimeScheduleService]
})
export class TimeScheduleModule { }
