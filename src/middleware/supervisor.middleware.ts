import { NestMiddleware, Req, Res, ForbiddenException } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "src/module/auth/auth.service";

export class SupervisorMiddleware implements NestMiddleware {
    constructor(private authService: AuthService) { }

    use(@Req() req: Request, @Res() res: Response, next: (error?: any) => void) {
        if (req.body.user.level === "supervisor") {
            next();
        }
        else throw new ForbiddenException({ error: "User Level tidak Supervisor" })
    }
}