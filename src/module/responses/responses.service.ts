import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Responses } from 'src/entity';
import { Repository } from 'typeorm';
import { CreateResponsesDTO } from './responses.dto';

@Injectable()
export class ResponsesService {
    constructor(
        @InjectRepository(Responses)
        private readonly responseRepository: Repository<Responses>
    ) { }

    getAll() {
        return this.responseRepository.find();
    }
    store(payload: CreateResponsesDTO) {
        const newResponses = this.responseRepository.create({
            text: payload.text
        });
        return this.responseRepository.save(newResponses);
    }

    async update(id: any, { text }: Partial<CreateResponsesDTO>) {
        await this.responseRepository.update({ id }, {
            text
        })
        return await this.responseRepository.findOneBy({ id });
    }

    async deleteData(id: any) {
        return await this.responseRepository.delete({ id })
    }
}
