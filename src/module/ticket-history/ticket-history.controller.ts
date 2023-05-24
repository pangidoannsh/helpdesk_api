import { Controller, Get, Param } from '@nestjs/common';
import { TicketHistoryService } from './ticket-history.service';

@Controller('ticket-history')
export class TicketHistoryController {
    constructor(
        private readonly historyService: TicketHistoryService
    ) { }

    @Get(':id')
    async getByTicketId(@Param('id') ticketId: number) {
        return await this.historyService.getByTicketId(ticketId)
    }

}
