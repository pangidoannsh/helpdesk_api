import { Body, Controller, Get, Param, Post, Req, Res, UsePipes, ValidationPipe, Put, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtGuard } from 'src/guard/jwt.guard';
import { LevelGuard } from 'src/guard/level.guard';
import { CreateUserDTO, UpdateUserBySupervisorDTO, UserDTO } from './user.dto';
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

    @Put()
    @UseGuards(JwtGuard)
    async editData(@Req() req: any, @Body() data: any, @Res() res: Response) {
        const updateData = await this.userService.updateData(req.user.id, data);
        res.status(201).send(updateData);
    }

    @Put(':id/edit-access')
    async editLevel(@Param("id") param: number, @Body() data: Partial<UpdateUserBySupervisorDTO>, @Res() res: Response) {
        const updateUser = await this.userService.updateBySupervisor(param, data);
        res.status(201).send(updateUser)
    }

    @Get('/agent')
    @UseGuards(JwtGuard, new LevelGuard("supervisor"))
    async getAgent() {
        return this.userService.allAgent();
    }

    @Get('/agent/count')
    @UseGuards(JwtGuard, new LevelGuard("supervisor", "agent"))
    async getAgentCount() {
        return this.userService.getAgentCount();
    }
}
