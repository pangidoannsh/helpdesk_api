import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FungsiSchedule } from 'src/entity/fungsi-schedule.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FungsiScheduleService {
    constructor(
        @InjectRepository(FungsiSchedule)
        private readonly scheduleRepository: Repository<FungsiSchedule>
    ) { }

    getSchedule() {
        return this.scheduleRepository.find();
    }

    async getScheduleByFungsi(fungsiId: number) {
        return this.scheduleRepository.createQueryBuilder('fungsi_schedule')
            .leftJoinAndSelect('fungsi_schedule.agentUser', 'user')
            .select(['fungsi_schedule', 'user.phone', 'user.id'])
            .where('fungsi_schedule.fungsiId = :fungsiId', { fungsiId })
            .getMany();
    }

    async storeData(fungsiId: any, agentId: any) {
        const create = this.scheduleRepository.create({
            fungsi: { id: fungsiId },
            agentUser: { id: agentId }
        })

        const save = await this.scheduleRepository.save(create);
        return await this.scheduleRepository.findOneBy({ id: save.id });
    }

    async deleteData(id: any) {
        try {
            return await this.scheduleRepository.delete({ id });
        } catch (err) {
            throw new NotAcceptableException();
        }
    }
}
