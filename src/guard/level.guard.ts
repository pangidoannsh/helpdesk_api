import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class LevelGuard implements CanActivate {
    constructor(private level: string) { }
    canActivate(context: ExecutionContext): boolean {
        const { user } = context.switchToHttp().getRequest();
        if (user.level === this.level) return true;
        throw new ForbiddenException("User Level Supervisor Required")
    }
}