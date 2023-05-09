import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Configuration } from 'src/entity';
import { Repository } from 'typeorm';
import { EditBaseScheduleDTO } from './configuration.dto';

@Injectable()
export class ConfigurationService {

    constructor(
        @InjectRepository(Configuration)
        private readonly configRepository: Repository<Configuration>
    ) { }

    async getBaseSchedule() {
        const getConfig = await this.configRepository.createQueryBuilder('config').getOne();
        if (getConfig) {
            return getConfig.BaseScheduleAgent;
        }
        const createConfig = await this.createConfig();
        return createConfig.BaseScheduleAgent;
    }

    async createConfig() {
        const create = this.configRepository.create({
            BaseScheduleAgent: 'time'
        });
        return await this.configRepository.save(create);
    }

    async updateBaseSchedule(payload: Partial<EditBaseScheduleDTO>) {
        const update = await this.configRepository.createQueryBuilder('config').update(({
            BaseScheduleAgent: payload.baseSchedule
        })).execute()


        if (update.affected === 1) {
            return await this.getBaseSchedule();
        }
        throw new BadGatewayException("gagal update base schedule")
    }
}
