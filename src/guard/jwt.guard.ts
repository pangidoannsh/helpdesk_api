import { AuthGuard } from "@nestjs/passport"
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken"
import { ForbiddenException, NotAcceptableException } from "@nestjs/common"

export class JwtGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any, context: any, status: any) {

        if (info instanceof TokenExpiredError) throw new NotAcceptableException("Token Expired");
        return super.handleRequest(err, user, info, context, status);
    }
}