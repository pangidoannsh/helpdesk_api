import { Controller, UseGuards, ValidationPipe } from '@nestjs/common';
import { UsePipes } from '@nestjs/common/decorators/core/use-pipes.decorator';
import { Get, Post, Put, Delete } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { JwtGuard } from 'src/guard/jwt.guard';
import { LevelGuard } from 'src/guard/level.guard';
import { CreateResponsesDTO } from './responses.dto';
import { ResponsesService } from './responses.service';

@Controller('responses')
export class ResponsesController {
    constructor(
        private readonly responseService: ResponsesService
    ) { }
    @Get()
    getResponses() {
        return this.responseService.getAll();
    }

    @Post()
    @UseGuards(JwtGuard, new LevelGuard('agent', 'supervisor'))
    @UsePipes(ValidationPipe)
    createResponses(@Body() payload: CreateResponsesDTO) {
        return this.responseService.store(payload);
    }

    @Put(':id')
    @UseGuards(JwtGuard, new LevelGuard('agent', 'supervisor'))
    @UsePipes(ValidationPipe)
    async editResponses(@Param('id') id: any, @Body() payload: CreateResponsesDTO) {
        return await this.responseService.update(id, payload);
    }

    @Delete(':id')
    @UseGuards(JwtGuard, new LevelGuard('agent', 'supervisor'))
    async deleteResponses(@Param('id') id: any) {
        return await this.responseService.deleteData(id);
    }
}
