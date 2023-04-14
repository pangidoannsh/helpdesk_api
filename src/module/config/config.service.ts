import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Configuration } from 'src/entity';
import { Repository } from 'typeorm';
import { EditBaseScheduleDTO } from './config.dto';

@Injectable()
export class ConfigService {
    constructor(
        @InjectRepository(Configuration)
        private readonly configRepository: Repository<Configuration>
    ) { }

    getBaseSchedule() {
        return this.configRepository.findOneBy({ id: 1 });
    }

    async createConfig() {
        const create = this.configRepository.create();
        return await this.configRepository.save(create);
    }

    async updateBaseSchedule(payload: Partial<EditBaseScheduleDTO>) {
        const id = 1;

        await this.configRepository.update({ id }, {
            BaseScheduleAgent: payload.baseSchedule
        })

        return await this.configRepository.findOneBy({ id });
    }
}
