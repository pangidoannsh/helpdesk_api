import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class LevelGuard implements CanActivate {
    constructor(private level: string, private optionalLevel?: string) { }
    canActivate(context: ExecutionContext): boolean {
        const { user } = context.switchToHttp().getRequest();
        if (user.level === this.level.toLowerCase()) return true;
        if (this.optionalLevel) {
            if (user.level === this.optionalLevel.toLowerCase()) return true;
            throw new ForbiddenException(`User Level ${this.level} or ${this.optionalLevel} Required`)
        }
        throw new ForbiddenException(`User Level ${this.level} Required`)
    }

}