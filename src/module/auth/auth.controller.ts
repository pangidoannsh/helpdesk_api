import { Controller } from '@nestjs/common';
import { Body, Post, Res, Req, UsePipes, Get, UseGuards } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import { Response, Request } from 'express';
import { LoginUserDTO } from '../user/user.dto';
import { AuthService } from './auth.service';
import { JwtGuard } from 'src/guard/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Get('profile')
    @UseGuards(JwtGuard)
    async getProfile(@Req() req: Request, @Res() res: Response) {
        res.send(req.user);
    }
    @Post('login')
    @UsePipes(ValidationPipe)
    async login(@Body() payload: LoginUserDTO, @Res() res: Response) {
        const token = await this.authService.validationUser(payload.phone, payload.password);

        if (token) {
            res.status(200).send(token)
        }
    }

    @Post('refresh-token')
    async refreshToken(@Body() payload: any, @Res() res: Response) {
        const refreshToken = payload.refresh_token;
        const token = await this.authService.refreshAccessToken(refreshToken);
        res.send(token)
    }
}
