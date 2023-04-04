import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketMessage } from 'src/entity';
import { TicketMessageController } from './ticket-message.controller';
import { TicketMessageService } from './ticket-message.service';

@Module({
    imports: [TypeOrmModule.forFeature([TicketMessage])],
    controllers: [TicketMessageController],
    providers: [TicketMessageService],
    exports: [TicketMessageService]
})
export class TicketMessageModule { }
