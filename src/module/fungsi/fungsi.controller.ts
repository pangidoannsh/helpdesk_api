import { Controller, Get, Post, Body, UsePipes, ValidationPipe, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/guard/jwt.guard';
import { LevelGuard } from 'src/guard/level.guard';
import { CreateFungsiDTO, EditFungsiDTO } from './fungsi.dto';
import { FungsiService } from './fungsi.service';

@Controller('fungsi')
export class FungsiController {
    constructor(
        private readonly fungsiService: FungsiService
    ) { }

    @Get()
    index() {
        return this.fungsiService.getAll();
    }

    @Post()
    @UseGuards(JwtGuard, new LevelGuard('agent', 'supervisor'))
    @UsePipes(ValidationPipe)
    create(@Body() payload: CreateFungsiDTO) {
        return this.fungsiService.store(payload)
    }

    @Put(':id')
    @UseGuards(JwtGuard, new LevelGuard('agent', 'supervisor'))
    @UsePipes(ValidationPipe)
    edit(@Param('id') param: any, @Body() payload: EditFungsiDTO) {
        return this.fungsiService.update(param, payload)
    }

    @Delete(':id')
    @UseGuards(JwtGuard, new LevelGuard('agent', 'supervisor'))
    deleteData(@Param('id') param: any) {
        return this.fungsiService.deleteData(param);
    }
}
