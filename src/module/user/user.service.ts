import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User as UserEntity } from 'src/entity';
import { Repository } from "typeorm";
import { encodePassword } from 'src/utils/bcrypt';
import { CreateUserDTO, UpdateUserBySupervisorDTO, UserDTO } from './user.dto';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class UserService implements OnModuleInit {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) { }
    
    async onModuleInit() {
        const totalUser = await this.totalUser()
        if(totalUser === 0){
            this.initSupervisor()
        }
    }
    async initSupervisor(){
        const rawPassword = '123456';
        const phone = '0811';
        const name = 'Edo Dev';
        const isActived = true
        
        try {
            const newUser = this.userRepository.create({
                phone, name, password: encodePassword(rawPassword),isActived
            })
            return this.userRepository.save(newUser);
        } catch (e) {
            throw new BadRequestException();
        }
    }
    async totalUser(){
        return await this.userRepository.createQueryBuilder('user')
        .getCount();
    }
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
            level: data.level,
            isActived: data.isActived
        })
        const updateUser = await this.userRepository.findOneBy({ id });
        return updateUser;
    }
}
