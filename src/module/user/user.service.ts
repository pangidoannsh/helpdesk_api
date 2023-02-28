import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User as UserEntity } from 'src/entity';
import { Repository } from "typeorm";
import { encodePassword } from 'src/utils/bcrypt';
import { CreateUserDTO, UpdateUserBySupervisorDTO, UserDTO } from './user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) { }

    all() {
        return this.userRepository.find();
    }

    findById(id: number) {
        return this.userRepository.findOneBy({ id })
    }

    findByPhone(phone: string) {
        return this.userRepository.findOneBy({ phone })
    }

    create(userData: CreateUserDTO) {
        const { phone, name, password: rawPassword } = userData;

        const newUser = this.userRepository.create({
            phone, name, password: encodePassword(rawPassword)
        })
        return this.userRepository.save(newUser);
    }

    async updateLevel(id: number, data: Partial<UpdateUserBySupervisorDTO>) {
        await this.userRepository.update({ id }, {
            level: data.level,
            isActived: data.isActived
        })
        const updateUser = await this.userRepository.findOneBy({ id });
        return updateUser;
    }
}
