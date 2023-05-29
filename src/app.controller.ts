import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { of } from 'rxjs';

@Controller()
export class AppController {

    @Get()
    index(@Res() res: Response) {
        res.send('API For Helpdesk Ticketing System Badan Pusat Statistik Riau')
    }

    @Get('file/:name')
    sendFile(@Param('name') name: string, @Res() res: Response) {
        return of(res.sendFile(join(process.cwd(), 'file-uploads/' + name)));
    }
}