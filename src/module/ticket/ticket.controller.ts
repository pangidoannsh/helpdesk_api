import { Controller, Get, Post, Req, Res, UsePipes, ValidationPipe, UseGuards, Body, Query, Param, Put } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/guard/jwt.guard';
import { LevelGuard } from 'src/guard/level.guard';
import { CreateTicketDTO, EditStatusTicketDTO, TicketFilterDTO } from './ticket.dto';
import { TicketService } from './ticket.service';


@Controller('ticket')
export class TicketController {
    constructor(
        private readonly ticketService: TicketService
    ) { }

    @Get()
    @UseGuards(JwtGuard, new LevelGuard('supervisor', 'agent'))
    async getAll(@Query() query: TicketFilterDTO) {
        return await this.ticketService.all(query);
    }

    @Get('user')
    @UseGuards(JwtGuard)
    async getByUser(@Req() req: Request, @Query() query: TicketFilterDTO) {
        return await this.ticketService.getByUser(req.user, query);
    }

    @Get('detail/:ticketId')
    @UseGuards(JwtGuard, new LevelGuard('supervisor', 'agent'))
    async getDetail(@Param('ticketId') param: string) {
        return await this.ticketService.getOneById(param);
    }

    @Post()
    @UsePipes(ValidationPipe)
    @UseGuards(JwtGuard)
    async create(@Req() req: Request, @Body() payload: CreateTicketDTO, @Res() res: Response) {
        const newTicket = await this.ticketService.store(payload, req.user);
        res.send(newTicket).status(201)
    }

    @Put(':id/status')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtGuard, new LevelGuard("supervisor", "agent"))
    async editStatus(@Body() payload: EditStatusTicketDTO, @Param('id') id: string) {
        return await this.ticketService.updateStatus(id, payload);
    }
}
