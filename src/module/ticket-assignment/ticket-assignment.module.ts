import { Module } from '@nestjs/common';
import { TicketAssignmentService } from './ticket-assignment.service';
import { TicketAssignmentController } from './ticket-assignment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketAssignment } from 'src/entity/ticket-assignment.entity';
import { ScheduleModule } from '../schedule/schedule.module';

@Module({
  imports: [TypeOrmModule.forFeature([TicketAssignment]), ScheduleModule],
  providers: [TicketAssignmentService],
  controllers: [TicketAssignmentController],
  exports: [TicketAssignmentService]
})
export class TicketAssignmentModule { }
