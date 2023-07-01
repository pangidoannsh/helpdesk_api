import { Controller, Get, Put, Post, UseGuards, UsePipes, Req, Body, ValidationPipe } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { JwtGuard } from 'src/guard/jwt.guard';
import { LevelGuard } from 'src/guard/level.guard';
import { UpdateConfiguration } from './configuration.dto';

@Controller('config')
export class ConfigurationController {
    constructor(
        private readonly configService: ConfigurationService
    ) { }

    @Get()
    @UseGuards(JwtGuard, new LevelGuard('supervisor'))
    async getConfig() {
        return await this.configService.getConfig();
    }

    @Post()
    @UseGuards(JwtGuard, new LevelGuard('supervisor'))
    async createConfig() {
        return await this.configService.createConfig();
    }

    @Put()
    @UseGuards(JwtGuard, new LevelGuard('supervisor'))
    @UsePipes(ValidationPipe)
    async editConfiguration(@Body() payload: UpdateConfiguration) {
        return await this.configService.updateConfig(payload);
    }

    @Get('system-mode')
    async getSystemMode() {
        return this.configService.config?.systemMode ?? (await this.configService.getConfig()).systemMode;
    }

}
