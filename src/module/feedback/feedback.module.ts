import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from 'src/entity';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { TicketModule } from '../ticket/ticket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback]), TicketModule],
  controllers: [FeedbackController],
  providers: [FeedbackService]
})
export class FeedbackModule { }
