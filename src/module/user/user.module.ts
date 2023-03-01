import { Module, NestModule } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity';
import { SupervisorMiddleware } from 'src/middleware/supervisor.middleware';
import { RequestMethod } from '@nestjs/common/enums';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService]
})

export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SupervisorMiddleware)
      .forRoutes(
        {
          path: "/user",
          method: RequestMethod.GET
        },
        {
          path: "/user/:id/edit-access",
          method: RequestMethod.PUT
        }
      )
  }
}
