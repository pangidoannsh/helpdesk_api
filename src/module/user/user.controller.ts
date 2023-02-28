import { Body, Controller, Get, Param, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { Put } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Response } from 'express';
import { CreateUserDTO } from './user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Get('user')
    index() {
        return this.userService.all()
    }

    @Post('register')
    @UsePipes(ValidationPipe)
    register(@Body() payload: CreateUserDTO) {
        return this.userService.create(payload);
    }

    @Put('user/:id/edit-level')
    editLevel(@Param("id") param: string, @Body() body: any, @Res() res: Response) {

    }
}
