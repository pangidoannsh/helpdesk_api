import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {

    @Get()
    index(@Res() res: Response) {
        res.send('API For Helpdesk Ticketing System Badan Pusat Statistik Riau')
    }
}