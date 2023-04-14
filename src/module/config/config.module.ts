import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from 'src/entity';

@Module({
  imports: [TypeOrmModule.forFeature([Configuration])],
  providers: [ConfigService],
  controllers: [ConfigController]
})
export class ConfigModule { }
