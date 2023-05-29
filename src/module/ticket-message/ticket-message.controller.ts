import { Controller, Get, Req, Res, Param, Body, UsePipes, ValidationPipe, Post, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/guard/jwt.guard';
import { CreateMessageDTO } from './ticket-message.dto';
import { TicketMessageService } from './ticket-message.service';
import { io, Socket } from 'socket.io-client'

@Controller('ticket-message')
export class TicketMessageController {
    socketClient: Socket;

    constructor(
        private readonly ticketMessageService: TicketMessageService
    ) {
        this.socketClient = io('http://localhost:3001');
    }

    @Get(':ticket')
    async getMessageByTicket(@Param('ticket') ticketId: string, @Req() req: Request, @Res() res: Response) {
        const result = await this.ticketMessageService.allByTicket(ticketId);
        res.send(result);
    }

    @Post()
    @UseGuards(JwtGuard)
    @UsePipes(ValidationPipe)
    async createMessage(@Req() req: Request, @Body() payload: CreateMessageDTO, @Res() res: Response) {
        // console.log(req.user);
        const newMessage = await this.ticketMessageService.store(payload.content, payload.ticketId, req.user);
        this.socketClient.emit('sendMessage', newMessage);
        res.send(newMessage);
    }
}
