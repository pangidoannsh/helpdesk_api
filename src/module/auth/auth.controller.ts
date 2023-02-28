import { Controller } from '@nestjs/common';
import { Body, Post, Res, UsePipes } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import { Response } from 'express';
import { LoginUserDTO } from '../user/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post('login')
    @UsePipes(ValidationPipe)
    async login(@Body() payload: LoginUserDTO, @Res() res: Response) {
        const access_token = await this.authService.validationUser(payload.phone, payload.password);

        if (access_token) {
            res.status(200).send({ access_token })
        }
    }
}
