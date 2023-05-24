import { Controller, Post, Param, Body, ValidationPipe, UsePipes } from '@nestjs/common';
import { TicketAssignmentService } from './ticket-assignment.service';
import { AddAgentAssignmentDTO } from './ticket-assignment.dto';

@Controller('ticket-assignment')
export class TicketAssignmentController {
    constructor(
        private readonly service: TicketAssignmentService
    ) { }

    @Post(':ticketId')
    @UsePipes(ValidationPipe)
    async addAgentAssignment(@Param('ticketId') ticketId: number, @Body() payload: AddAgentAssignmentDTO) {
        const newAssign = await this.service.create(ticketId, payload.agentId);
        return this.service.getById(newAssign.id);
    }

}
