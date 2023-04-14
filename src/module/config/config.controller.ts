import { Controller, Get, Put, Post, UseGuards, UsePipes, Req, Body, ValidationPipe } from '@nestjs/common';
import { ConfigService } from './config.service';
import { JwtGuard } from 'src/guard/jwt.guard';
import { LevelGuard } from 'src/guard/level.guard';
import { Request } from 'express';
import { EditBaseScheduleDTO } from './config.dto';

@Controller('config')
export class ConfigController {
    constructor(
        private readonly configService: ConfigService
    ) { }

    @Get('base-schedule')
    @UseGuards(JwtGuard, new LevelGuard('supervisor'))
    getBaseSchedule() {
        return this.configService.getBaseSchedule();
    }

    @Post()
    @UseGuards(JwtGuard, new LevelGuard('supervisor'))
    async createConfig() {
        return await this.configService.createConfig();
    }

    @Put('base-schedule')
    @UseGuards(JwtGuard, new LevelGuard("supervisor"))
    @UsePipes(ValidationPipe)
    async editBaseSchedule(@Req() req: Request, @Body() payload: EditBaseScheduleDTO) {
        return await this.configService.updateBaseSchedule(payload);
    }

}
