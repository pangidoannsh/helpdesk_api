import { AuthGuard } from "@nestjs/passport"
import { TokenExpiredError } from "jsonwebtoken"
import { NotAcceptableException } from "@nestjs/common"

export class JwtGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any, context: any, status: any) {
        if (info instanceof TokenExpiredError) throw new NotAcceptableException({ error: "Token Expired" });
        return super.handleRequest(err, user, info, context, status);
    }
}