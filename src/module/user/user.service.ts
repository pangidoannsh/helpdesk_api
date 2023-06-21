import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User as UserEntity } from 'src/entity';
import { Repository } from "typeorm";
import { comparePassword, encodePassword } from 'src/utils/bcrypt';
import { CreateUserDTO, UpdatePasswordDTO, UpdateUserProfileDTO, UserDTO } from './user.dto';
import { BadRequestException, NotAcceptableException } from '@nestjs/common/exceptions';

@Injectable()
export class UserService implements OnModuleInit {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) { }

    async onModuleInit() {
        await this.initSupervisor()
    }

    async initSupervisor() {
        const totalUser = await this.userRepository.count();

        try {
            if (totalUser === 0) {
                const phone = '0811';
                const name = 'Supervisor'
                const level = 'supervisor';
                const rawPassword = '123456';
                const newUser = this.userRepository.create({
                    phone, name, password: encodePassword(rawPassword), level
                })
                return this.userRepository.save(newUser);
            }
        } catch (e) {
            console.log('Supervisor created on phone 0811');

        }
    }

    async all() {
        let result: UserEntity[] = [];
        await this.userRepository.find().then(res => {
            result = res;
        });

        return result.map(data => ({ ...data }));
    }
    async getTotalUser() {
        return await this.userRepository.count();
    }
    async allEmployee() {
        return await this.userRepository.findBy({ level: "pegawai" });
    }
    async allAgent() {
        return await this.userRepository.findBy({ level: "agent" });
    }

    async getPhoneById(user: any): Promise<string> {
        const { id } = user;
        return (await this.userRepository.createQueryBuilder('user')
            .where('user.id = :id', { id })
            .addSelect('user.phone').getOne()).phone
    }

    async findById(id: number, isFullData?: boolean): Promise<UserEntity> {
        if (isFullData) {
            return await this.userRepository.createQueryBuilder('user')
                .leftJoinAndSelect('user.fungsi', 'fungsi')
                .addSelect('user.password')
                .where({ id })
                .getOne();
        }
        return await this.userRepository.findOneBy({ id })
    }

    findByPhone(phone: string) {
        return this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.fungsi', 'fungsi')
            .addSelect('user.password')
            .where({ phone })
            .getOne();
    }

    create(userData: CreateUserDTO) {
        const { phone, name, password: rawPassword, fungsiId, level } = userData;

        try {
            const newUser = this.userRepository.create({
                phone, name, password: encodePassword(rawPassword), fungsi: { id: fungsiId }, level
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

    async updateProfile(id: number, data: Partial<UpdateUserProfileDTO>) {
        const { fungsiId, level, name, phone } = data

        await this.userRepository.update({ id }, {
            level, fungsi: { id: fungsiId }, phone, name
        })
        const updateUser = await this.userRepository.findOneBy({ id });
        return updateUser;
    }

    async updatePassword(id: number, data: UpdatePasswordDTO) {
        const { currentPassword, newPassword } = data;
        const userDB = await this.findById(id, true);
        console.log(userDB);

        if (userDB) {
            if (comparePassword(currentPassword, userDB.password)) {
                this.userRepository.update({ id }, {
                    password: encodePassword(newPassword)
                })
                return "Berhasil"
            } else {
                throw new NotAcceptableException("Password Salah")
            }
        }
        throw new BadRequestException("Gagal");
    }
}
