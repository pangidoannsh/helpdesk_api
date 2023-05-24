import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Faq } from 'src/entity/faq.entity';
import { displayDateFromArrayObject, displayDateFromObject } from 'src/utils/date';
import { Repository } from 'typeorm';

@Injectable()
export class FaqService {
    constructor(
        @InjectRepository(Faq)
        private readonly faqRepository: Repository<Faq>
    ) { }

    async getAll(subject: string) {
        if (subject) {
            return await this.faqRepository.createQueryBuilder('faq')
                .where('faq.subject LIKE :subject', { subject: `%${subject}%` })
                .getMany()
        }

        return await this.faqRepository.find();
    }

    async store(subject: string, description: string, userCreateId: any) {
        try {
            const create = this.faqRepository.create({
                subject, description, userCreate: { id: userCreateId }
            })
            return displayDateFromObject(await this.faqRepository.save(create), 'createdAt');
        } catch (e) {

        }
    }

    async update(id: any, subject: string, description: string, userUpdateId: any) {
        const update = this.faqRepository.update({ id }, {
            subject, description, userUpdate: { id: userUpdateId }
        })

        return update;
    }
}
