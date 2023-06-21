import { Body, Controller, Get, Param, Post, Req, Res, UsePipes, ValidationPipe, Put, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/guard/jwt.guard';
import { LevelGuard } from 'src/guard/level.guard';
import { CreateUserDTO, UpdatePasswordDTO, UpdateUserProfileDTO } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }
    @Get()
    // @UseGuards(JwtGuard, new LevelGuard('supervisor'))
    async index() {
        return this.userService.all()
    }
    @Get('phone')
    @UseGuards(JwtGuard)
    async getPhoneNumber(@Req() req: Request) {
        return await this.userService.getPhoneById(req.user)
    }
    @Get('employee')
    @UseGuards(JwtGuard, new LevelGuard('agent', 'supervisor'))
    getEmployee() {
        return this.userService.allEmployee();
    }
    @Post('register')
    @UsePipes(ValidationPipe)
    register(@Body() payload: CreateUserDTO) {
        return this.userService.create(payload);
    }
    @Put('password')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtGuard)
    async editPassword(@Req() req: any, @Body() data: UpdatePasswordDTO) {
        const updatePassword = await this.userService.updatePassword(req.user.id, data);
        return updatePassword;
    }
    // @Put()
    // @UseGuards(JwtGuard)
    // async editData(@Req() req: any, @Body() data: any, @Res() res: Response) {
    //     const updateData = await this.userService.updateData(req.user.id, data);
    //     res.status(201).send(updateData);
    // }

    @Put(':id')
    @UsePipes(ValidationPipe)
    @UseGuards(JwtGuard)
    async editProfile(@Param("id") param: number, @Body() data: UpdateUserProfileDTO, @Res() res: Response) {
        const updateUser = await this.userService.updateProfile(param, data);
        res.status(201).send(updateUser)
    }

    @Get('agent')
    @UseGuards(JwtGuard, new LevelGuard("supervisor", "agent"))
    async getAgent() {
        return this.userService.allAgent();
    }

}
