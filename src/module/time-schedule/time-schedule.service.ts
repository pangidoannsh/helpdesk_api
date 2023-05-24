import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSchedule } from 'src/entity';
import { displayDateFromArrayObject, displayDateFromObject } from 'src/utils/date';
import { Repository } from 'typeorm';
import { QueryGetSchedule } from './time-schedule.dto';

@Injectable()
export class TimeScheduleService {
    constructor(
        @InjectRepository(TimeSchedule)
        private readonly scheduleRepository: Repository<TimeSchedule>
    ) { }

    getAll() {
        return this.scheduleRepository.find();
    }
    async getFromThisMonth(query?: QueryGetSchedule) {
        if (query) {
            const { month, year } = query;
            if (month && year) {
                return await this.scheduleRepository.createQueryBuilder('time_schedule')
                    .where('YEAR(time_schedule.dutyTime) = :year', { year })
                    .andWhere('MONTH(time_schedule.dutyTime) = :month', { month })
                    .leftJoinAndSelect('time_schedule.agentUser', 'user')
                    // .leftJoinAndSelect('time_schedule.fungsi', 'fungsi')
                    .getMany();
            }
            // jika hanya month saja atau year saja, maka akan mereturn state dibawah
        }
        return await this.scheduleRepository.createQueryBuilder('time_schedule')
            .leftJoinAndSelect('time_schedule.agentUser', 'user')
            .where("DATE_FORMAT(time_schedule.dutyTime, '%Y-%m') >= DATE_FORMAT(NOW(), '%Y-%m')")
            .getMany();
    }

    async getByThisYear() {
        return await this.scheduleRepository.createQueryBuilder('time_schedule')
            .leftJoinAndSelect('time_schedule.agentUser', 'user')
            .where('YEAR(time_schedule.dutyTime) = YEAR(NOW())')
            // .andWhere('MONTH(time_schedule.dutyTime) = MONTH(NOW())')
            .getMany();
    }
    async storeAgent(agentId: any, dutyTime: any) {
        try {
            const create = this.scheduleRepository.create({
                agentUser: { id: agentId },
                dutyTime
            });
            const saved = await this.scheduleRepository.save(create);
            return await this.scheduleRepository.findOneBy({ id: saved.id });
        } catch (e) {
            throw new NotAcceptableException("Agent Sudah Ada di Jadwal")
        }
    }

    async getTodaySchedule() {
        return await this.scheduleRepository.createQueryBuilder('time_schedule')
            .leftJoinAndSelect('time_schedule.agentUser', 'user')
            .select(['time_schedule', 'user.phone', 'user.id'])
            .where('DATE(time_schedule.dutyTime) = DATE(NOW())')
            .getMany();
    }

    async deleteSchedule(id: any) {
        try {
            return await this.scheduleRepository.delete({ id });
        } catch (err) {
            throw new NotAcceptableException();
        }
    }
}
