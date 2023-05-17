import { Injectable, NestMiddleware, ServiceUnavailableException } from '@nestjs/common';
import { NextFunction } from 'express';
import { ConfigurationService } from 'src/module/configuration/configuration.service';

@Injectable()
export class SystemMiddleware implements NestMiddleware {
    constructor(
        private readonly config: ConfigurationService
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const { config } = this.config;
        if (config.systemMode === 'ready') {
            next();
        } else {
            throw new ServiceUnavailableException('System sedang Maintenance!')
        }
    }
}