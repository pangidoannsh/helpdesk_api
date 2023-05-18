import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketMessageModule } from '../ticket-message/ticket-message.module';
import { Ticket } from 'src/entity';
import { NotificationModule } from '../notification/notification.module';
import { ConfigurationModule } from '../configuration/configuration.module';
import { ConfigurationService } from '../configuration/configuration.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]),
    TicketMessageModule, NotificationModule, ConfigurationModule],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService]
})
export class TicketModule { }
