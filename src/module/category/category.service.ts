import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entity';
import { Repository } from 'typeorm';
import { CreateCategoryDTO } from './category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>
    ) { }

    async all() {
        return await this.categoryRepo.find();
    }

    async store(payload: CreateCategoryDTO) {
        const createCategory = this.categoryRepo.create({
            categoryName: payload.name,
            parentOf: payload.parent
        });
        return await this.categoryRepo.save(createCategory)
    }

    async update(id: any, payload: Partial<CreateCategoryDTO>) {
        await this.categoryRepo.update({ id }, {
            categoryName: payload.name,
            parentOf: payload.parent
        })
        return this.categoryRepo.findOneBy({ id });
    }
    async delete(id: any) {
        return await this.categoryRepo.delete({ id })
    }
}
