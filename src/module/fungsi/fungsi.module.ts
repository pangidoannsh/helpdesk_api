import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fungsi } from 'src/entity';
import { FungsiController } from './fungsi.controller';
import { FungsiService } from './fungsi.service';

@Module({
  imports: [TypeOrmModule.forFeature([Fungsi])],
  controllers: [FungsiController],
  providers: [FungsiService]
})
export class FungsiModule { }
