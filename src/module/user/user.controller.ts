import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
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
}
