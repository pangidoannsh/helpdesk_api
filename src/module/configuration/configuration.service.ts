import { BadGatewayException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Configuration } from 'src/entity';
import { Repository } from 'typeorm';
import { UpdateConfiguration } from './configuration.dto';

@Injectable()
export class ConfigurationService implements OnModuleInit {
    public config: Configuration;

    constructor(
        @InjectRepository(Configuration)
        private readonly configRepository: Repository<Configuration>
    ) { }

    async onModuleInit() {
        const getConfig = await this.getConfig();
        if (getConfig) {
            this.config = getConfig;
        } else {
            this.config = await this.createConfig();
        }
    }

    async getConfig() {
        return await this.configRepository.createQueryBuilder('config').getOne();
    }

    async createConfig() {
        const create = this.configRepository.create();
        return await this.configRepository.save(create);
    }

    async updateConfig(payload: Partial<UpdateConfiguration>) {
        const update = await this.configRepository.createQueryBuilder('config').update({
            BaseScheduleAgent: payload.baseSchedule,
            isSendEmail: payload.isSendEmail,
            isSendWhatsapp: payload.isSendWhatsapp,
            systemMode: payload.systemMode,
            ticketDeadline: payload.ticketDeadline
        }).execute();

        if (update.affected === 1) {
            this.config = await this.getConfig();
            return this.config;
        }
        throw new BadGatewayException("gagal update base schedule")
    }
}
