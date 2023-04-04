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

    findById(id: number) {
        return this.userRepository.findOneBy({ id })
    }

    findByPhone(phone: string) {
        return this.userRepository.createQueryBuilder('user')
            .addSelect('user.password')
            .where({ phone })
            .getOne();
    }

    create(userData: CreateUserDTO) {
        const { phone, name, password: rawPassword, fungsi } = userData;

        try {
            const newUser = this.userRepository.create({
                phone, name, password: encodePassword(rawPassword), fungsi
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
            level: data.level,
            isActived: data.isActived
        })
        const updateUser = await this.userRepository.findOneBy({ id });
        return updateUser;
    }
}
