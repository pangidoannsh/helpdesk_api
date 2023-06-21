import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io';
import { TicketMessageService } from './ticket-message.service';

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
export class TicketMessageGateway {
    @WebSocketServer()
    server: Server;
    constructor(
        private readonly ticketMessageService: TicketMessageService
    ) { }

    @SubscribeMessage('sendMessage')
    async onNewMessage(@MessageBody() body: any) {
        this.server.emit('receiveMessage', body)
    }

}