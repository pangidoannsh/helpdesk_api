import { Module } from '@nestjs/common';
import { TicketHistoryService } from './ticket-history.service';
import { TicketHistoryController } from './ticket-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketHistory } from 'src/entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketHistory])],
  providers: [TicketHistoryService],
  controllers: [TicketHistoryController],
  exports: [TicketHistoryService]
})
export class TicketHistoryModule { }
