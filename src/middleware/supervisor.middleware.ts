import { NestMiddleware, Req, Res, ForbiddenException } from "@nestjs/common";
import { Request, Response } from "express";

export class SupervisorMiddleware implements NestMiddleware {
    use(@Req() req: Request, @Res() res: Response, next: (error?: any) => void) {
        if (req.body.user.level === "supervisor") {
            next();
        }
        else throw new ForbiddenException({ error: "User Level tidak Supervisor" })
    }
}