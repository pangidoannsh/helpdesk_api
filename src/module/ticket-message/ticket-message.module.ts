import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketMessage } from 'src/entity';
import { TicketMessageController } from './ticket-message.controller';
import { TicketMessageService } from './ticket-message.service';
import { TicketMessageGateway } from './ticket-message.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([TicketMessage])],
    controllers: [TicketMessageController],
    providers: [TicketMessageService, TicketMessageGateway],
    exports: [TicketMessageService]
})
export class TicketMessageModule { }
