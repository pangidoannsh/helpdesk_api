import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConfig } from "src/config/jwt.config";
import { UserService } from "../user/user.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: jwtConfig.secret
        })
    }

    async validate(payload: any) {
        const user = await this.userService.findById(payload.id);

        if (!user.isActived) throw new UnauthorizedException("User Belum Aktif");

        return user;
    }
}