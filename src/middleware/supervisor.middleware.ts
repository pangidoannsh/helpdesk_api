import { NestMiddleware, Req, Res, UnauthorizedException } from "@nestjs/common";
import { Request, Response } from "express";

export class SupervisorMiddleware implements NestMiddleware {
    use(@Req() req: Request, @Res() res: Response, next: (error?: any) => void) {
        if (req.body.user_level === "supervisor") {
            next();
        }
        else throw new UnauthorizedException({ error: "User Level tidak Supervisor" })
    }
}