import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io';
import { TicketMessageService } from './ticket-message.service';
import { CreateMessageDTO } from './ticket-message.dto';

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:3000']
    }
})
export class TicketMessageGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;
    constructor(
        private readonly ticketMessageService: TicketMessageService
    ) { }

    onModuleInit() {
        this.server.on('connection', (socket) => {
            // console.log('connected');
        })
    }
    @SubscribeMessage('sendMessage')
    async onNewMessage(@MessageBody() body: any) {
        this.server.emit('receiveMessage', body)
        // try {
        //     const newMessage = await this.ticketMessageService.store(body.content, body.ticketId, body.userSend)
        // } catch (e) {

        // }
    }

}