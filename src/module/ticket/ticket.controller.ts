import { Controller, Get, Post, Req, Res, UsePipes, ValidationPipe, UseGuards, Body, Query, Param, Put, Delete } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/guard/jwt.guard';
import { LevelGuard } from 'src/guard/level.guard';
import { CreateTicketDTO, EditTicketDTO, EditTicketStatusDTO, TicketFilterDTO } from './ticket.dto';
import { TicketService } from './ticket.service';


@Controller('ticket')
export class TicketController {
    constructor(
        private readonly ticketService: TicketService
    ) { }
    // @Get('phone')
    // async getPhoneAgent(@Body('fungsiId') fungsiId: number) {
    //     return await this.ticketService.getAgentSchedule(fungsiId);
    // }
    @Get()
    @UseGuards(JwtGuard, new LevelGuard('supervisor', 'agent'))
    async getAll(@Query() query: TicketFilterDTO) {
        return await this.ticketService.getByDashboard(query);
    }
    @Get('length')
    @UseGuards(JwtGuard, new LevelGuard('supervisor', 'agent'))
    getLengthOfAll(@Query() query: TicketFilterDTO) {
        return this.ticketService.getLengthAll(query);
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
    @Delete(':id')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtGuard)
    async deleteTicket(@Param('id') id: any) {
        return await this.ticketService.deleteData(id)
    }

    @Put(':id/status')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtGuard, new LevelGuard("supervisor", "agent"))
    async editStatus(@Body() payload: EditTicketStatusDTO, @Param('id') id: string) {
        return await this.ticketService.updateStatus(id, payload.status);
    }

    @Get('monthly')
    @UseGuards(JwtGuard, new LevelGuard("supervisor", "agent"))
    async getMonthlyTicket(@Query('year') year: any) {
        return await this.ticketService.getCountMonthlyTicket(year);
    }

    @Get('count/status')
    @UseGuards(JwtGuard, new LevelGuard("supervisor", "agent"))
    async getTicketCountEachStatus() {
        return await this.ticketService.getTicketCountEachStatus();
    }
}
