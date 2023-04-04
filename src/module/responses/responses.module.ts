import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Responses } from 'src/entity';
import { ResponsesController } from './responses.controller';
import { ResponsesService } from './responses.service';

@Module({
  imports: [TypeOrmModule.forFeature([Responses])],
  controllers: [ResponsesController],
  providers: [ResponsesService]
})
export class ResponsesModule { }
