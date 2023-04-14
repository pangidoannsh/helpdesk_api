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
            const getFaq = await this.faqRepository.createQueryBuilder('faq')
                .where('user.subject LIKE :subject', { subject: `%${subject}%` })
                .getMany()
            return displayDateFromArrayObject(getFaq, "createdAt");
        }

        return displayDateFromArrayObject(await this.faqRepository.find(), "createdAt");
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
}
