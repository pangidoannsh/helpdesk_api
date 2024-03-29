import { Injectable, UnauthorizedException, NotAcceptableException, BadGatewayException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { refreshTokenConfig } from 'src/config/jwt.config';
import { RefreshToken, User } from 'src/entity';
import { comparePassword } from 'src/utils/bcrypt';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { TokenExpiredError } from "jsonwebtoken";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        @InjectRepository(RefreshToken)
        private refreshToken: Repository<RefreshToken>
    ) { }
    async validationUser(phone: string, password: string) {
        const userDB = await this.userService.findByPhone(phone);

        if (userDB) {
            if (comparePassword(password, userDB.password)) {

                // setup data
                const user_data = {
                    id: userDB.id, name: userDB.name, level: userDB.level, fungsi: userDB.fungsi
                };
                // generate jwt access token
                const access_token = await this.jwtService.signAsync(user_data);
                // generate jwt refresh token
                const refresh_token = await this.createRefreshToken(userDB);

                return { access_token, refresh_token, user_data };
            }
            else throw new UnauthorizedException({ error: "Password Salah" })
        }
        else throw new UnauthorizedException({ error: "Nomor Telepon Tidak ditemukan" })
    }

    getUser(token: string) {
        try {
            return this.jwtService.verify(token)
        }
        catch (e) {
            if (e instanceof TokenExpiredError) throw new NotAcceptableException("Token User is Expired");
            else throw new UnauthorizedException("Unautheticated User")
        }
    }
    async refreshAccessToken(refTokenUser: string) {
        const payload = await this.decodeToken(refTokenUser);
        const ref_token = await this.refreshToken.findOneBy({ id: payload.jid });
        return ref_token.user;
    }

    async decodeToken(token: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(token);
        } catch (e) {
            if (e instanceof TokenExpiredError) throw new UnauthorizedException("Token Expired")
            else throw new UnauthorizedException("Unautheticated User")
        }
    }
    async createRefreshToken(user: User) {
        const expiredAt = new Date();
        const expiration = 3600
        expiredAt.setTime(expiredAt.getTime() + expiration);

        const createRefreshToken = this.refreshToken.create({ user, expiredAt })
        const saveRefreshToken = await this.refreshToken.save(createRefreshToken);
        const payload = {
            jid: saveRefreshToken.id
        }

        const refresh_token = await this.jwtService.signAsync(payload, refreshTokenConfig.signOptions)

        return refresh_token;
    }
}
