import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from 'src/config/jwt.config';
import { RefreshToken, User } from 'src/entity';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    JwtModule.register(jwtConfig)
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule { }
