import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User as UserEntity } from 'src/entity';
import { Repository } from "typeorm";
import { encodePassword } from 'src/utils/bcrypt';
import { CreateUserDTO, UpdateUserBySupervisorDTO, UserDTO } from './user.dto';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) { }

    async all() {
        let result: UserEntity[] = [];
        await this.userRepository.find().then(res => {
            result = res;
        });

        return result.map(data => ({ ...data }));
    }

    async allEmployee() {
        return await this.userRepository.findBy({ level: "pegawai" });
    }
    async allAgent() {
        return await this.userRepository.findBy({ level: "agent" });
    }

    async getAgentCount() {
        return await this.userRepository.createQueryBuilder('user')
            .where('user.level = "agent"').getCount();
    }
    findById(id: number): Promise<UserEntity> {
        return this.userRepository.findOneBy({ id })
    }

    findByPhone(phone: string) {
        return this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.fungsi', 'fungsi')
            .addSelect('user.password')
            .where({ phone })
            .getOne();
    }

    create(userData: CreateUserDTO) {
        const { phone, name, password: rawPassword, fungsiId } = userData;

        try {
            const newUser = this.userRepository.create({
                phone, name, password: encodePassword(rawPassword), fungsi: { id: fungsiId }
            })
            return this.userRepository.save(newUser);
        } catch (e) {
            throw new BadRequestException();
        }
    }
    async updateData(id: number, data: UserDTO) {
        const { phone, name } = data;
        await this.userRepository.update({ id }, {
            phone, name
        })
        return await this.userRepository.findOneBy({ id });
    }

    async updateBySupervisor(id: number, data: Partial<UpdateUserBySupervisorDTO>) {
        await this.userRepository.update({ id }, {
            level: data.level
        })
        const updateUser = await this.userRepository.findOneBy({ id });
        return updateUser;
    }
}
