import { Body, Controller, Get, Param, Post, Req, Res, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDTO, UpdateUserBySupervisorDTO, UserDTO } from './user.dto';
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

    @Put('user')
    async editData(@Body() data: any, @Res() res: Response) {
        const updateData = await this.userService.updateData(data.user.id, data);
        res.status(201).send(updateData);
    }

    @Put('user/:id/edit-access')
    async editLevel(@Param("id") param: number, @Body() data: Partial<UpdateUserBySupervisorDTO>, @Res() res: Response) {
        const updateUser = await this.userService.updateBySupervisor(param, data);
        res.status(201).send(updateUser)
    }
}
