import { Controller, Get, UsePipes, ValidationPipe, Body, Post } from '@nestjs/common';
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
    @UsePipes(ValidationPipe)
    async create(@Body() payload: CreateCategoryDTO) {
        return await this.categoryService.store(payload);
    }
}
