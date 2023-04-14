import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSchedule } from 'src/entity';
import { displayDateFromArrayObject, displayDateFromObject } from 'src/utils/date';
import { Repository } from 'typeorm';

@Injectable()
export class TimeScheduleService {
    constructor(
        @InjectRepository(TimeSchedule)
        private readonly scheduleRepository: Repository<TimeSchedule>
    ) { }

    async getAll() {
        return await this.scheduleRepository.find();
    }

    async storeAgent(agentId: any, dutyTime: any) {
        try {
            const create = this.scheduleRepository.create({
                user: { id: agentId },
                dutyTime
            });
            const saved = await this.scheduleRepository.save(create);
            return await this.scheduleRepository.findOneBy({ id: saved.id });
        } catch (e) {
            throw new NotAcceptableException("Agent Sudah Ada di Jadwal")
        }
    }

    async deleteSchedule(id: any) {
        try {
            return await this.scheduleRepository.delete({ id });
        } catch (err) {
            throw new NotAcceptableException();
        }
    }
}
