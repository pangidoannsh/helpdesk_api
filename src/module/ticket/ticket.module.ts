import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketMessageModule } from '../ticket-message/ticket-message.module';
import { Ticket } from 'src/entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]),
    TicketMessageModule],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule { }
