import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FungsiSchedule } from 'src/entity/fungsi-schedule.entity';
import { FungsiScheduleService } from './fungsi-schedule.service';
import { FungsiScheduleController } from './fungsi-schedule.controller';

@Module({
    imports: [TypeOrmModule.forFeature([FungsiSchedule])],
    providers: [FungsiScheduleService],
    controllers: [FungsiScheduleController],
    exports: [FungsiScheduleService]
})
export class FungsiScheduleModule { }
