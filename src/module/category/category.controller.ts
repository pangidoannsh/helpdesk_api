import { Controller, Get, UsePipes, ValidationPipe, Body, Post, Put, UseGuards, Param, Delete } from '@nestjs/common';
import { JwtGuard } from 'src/guard/jwt.guard';
import { LevelGuard } from 'src/guard/level.guard';
import { CreateCategoryDTO } from './category.dto';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) { }

    @Get()
    async index() {
        return await this.categoryService.all();
    }

    @Post()
    @UseGuards(JwtGuard, new LevelGuard('supervisor', 'agent'))
    @UsePipes(ValidationPipe)
    async create(@Body() payload: CreateCategoryDTO) {
        return await this.categoryService.store(payload);
    }

    @Put(':id')
    @UseGuards(JwtGuard, new LevelGuard('supervisor', 'agent'))
    @UsePipes(ValidationPipe)
    async editCategory(@Param('id') param: any, @Body() payload: CreateCategoryDTO) {
        return this.categoryService.update(param, payload);
    }

    @Delete(':id')
    @UseGuards(JwtGuard, new LevelGuard('supervisor', 'agent'))
    @UsePipes(ValidationPipe)
    async deleteCategory(@Param('id') param: any) {
        return this.categoryService.delete(param);
    }
}
