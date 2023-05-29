import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketAssignment } from 'src/entity';
import { Repository } from 'typeorm';
import { ScheduleService } from '../schedule/schedule.service';

@Injectable()
export class TicketAssignmentService {
    constructor(
        @InjectRepository(TicketAssignment)
        private readonly repository: Repository<TicketAssignment>,
        private readonly schedule: ScheduleService
    ) { }

    async getById(id: number) {
        return await this.repository.findOneBy({ id });
    }
    async getByTicketId(id: number) {
        return await this.repository.findOneBy({ ticket: { id } })
    }
    async create(ticketId: number, agentId: number) {
        const createData = this.repository.create({
            ticket: { id: ticketId },
            user: { id: agentId }
        })
        return await this.repository.save(createData)
    }
    async createFromSchedule(ticketId: number, userFungsiId: number) {
        const idAgents = await this.schedule.getAssignAgentId(userFungsiId);

        idAgents.forEach(async id => {
            await this.create(ticketId, id)
        })
    }
}
