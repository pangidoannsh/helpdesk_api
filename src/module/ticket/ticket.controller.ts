import {
    Controller, Get, Post, Req, Res, UsePipes, ValidationPipe, UseGuards, Body, Query, Param, Put, Delete,
    UploadedFile, UseInterceptors, ParseFilePipe, FileTypeValidator, BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/guard/jwt.guard';
import { LevelGuard } from 'src/guard/level.guard';
import { CreateTicketDTO, EditTicketDTO, EditTicketStatusDTO, FileSizeValidationPipe, TicketFilterDTO } from './ticket.dto';
import { TicketService } from './ticket.service';
import { diskStorage } from 'multer';
import { editFileName } from './file.helper';

@Controller('ticket')
export class TicketController {
    constructor(
        private readonly ticketService: TicketService
    ) { }

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
    async getDetail(@Param('ticketId') param: number) {
        return await this.ticketService.getOneById(param);
    }

    @Post()
    @UsePipes(ValidationPipe)
    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './file-uploads',
            filename: editFileName
        })
    }))
    async create(
        @Req() req: any,
        @Body() payload: CreateTicketDTO,
        @Res() res: Response,
        @UploadedFile() file: Express.Multer.File
    ) {
        console.log(file);

        const { level } = req.user;
        if (file) {
            const newTicket = await this.ticketService.store(payload, req.user, level !== 'pegawai', file.filename);
            res.status(201).send(newTicket)
        } else {
            const newTicket = await this.ticketService.store(payload, req.user, level !== 'pegawai');
            res.status(201).send(newTicket)
        }

    }
    @Delete(':id')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtGuard, new LevelGuard('supervisor'))
    async deleteTicket(@Param('id') id: any) {
        return await this.ticketService.deleteData(id)
    }

    @Put(':id/status')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtGuard, new LevelGuard("supervisor", "agent"))
    async editStatus(@Req() req: Request, @Body() payload: EditTicketStatusDTO, @Param('id') id: number) {
        return await this.ticketService.updateStatus(id, payload.status, req.user);
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

    @Get('completion-rate')
    async getTicketCompletionRate() {
        return this.ticketService.getTicketCompletionRate();
    }
}
