import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fungsi } from 'src/entity';
import { Repository } from 'typeorm';
import { CreateFungsiDTO, EditFungsiDTO } from './fungsi.dto';

@Injectable()
export class FungsiService {
    constructor(
        @InjectRepository(Fungsi)
        private readonly fungsiRepository: Repository<Fungsi>
    ) { }

    getAll() {
        return this.fungsiRepository.find();
    }

    store(payload: CreateFungsiDTO) {
        const newFungsi = this.fungsiRepository.create({
            name: payload.fungsiname
        })
        return this.fungsiRepository.save(newFungsi);
    }

    async update(id: any, { fungsiname }: Partial<EditFungsiDTO>) {
        await this.fungsiRepository.update({ id }, {
            name: fungsiname
        })
        return await this.fungsiRepository.findOneBy({ id })
    }

    async deleteData(id: any) {
        try {
            return await this.fungsiRepository.delete({ id })
        } catch (e) {
            throw new HttpException("Tidak dapat menghapus data ini, karena Fungsi ini berelasi ke data lainnya!",
                406, { cause: new Error(e) })
        }
    }
}
