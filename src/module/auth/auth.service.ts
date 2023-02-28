import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/utils/bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }
    async validationUser(phone: string, password: string) {
        const userDB = await this.userService.findByPhone(phone);

        if (userDB) {
            if (comparePassword(password, userDB.password)) {
                const jwt = await this.jwtService.signAsync({ id: userDB.id, name: userDB.name, level: userDB.level, isActived: userDB.isActived });
                return jwt;
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
            throw new UnauthorizedException("Unauthenticated User");
        }
    }
}
