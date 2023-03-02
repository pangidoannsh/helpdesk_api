import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './module/user/user.module';
import { TicketModule } from './module/ticket/ticket.module';
import { AuthModule } from './module/auth/auth.module';
import entities from './entity';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "helpdesk_it_db",
    entities,
    synchronize: true
  }), UserModule, TicketModule, AuthModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(AuthMiddleware)
    //   .exclude(
    //     {
    //       path: "/auth/login",
    //       method: RequestMethod.POST
    //     },
    //     {
    //       path: "/auth/refresh-token",
    //       method: RequestMethod.POST
    //     },
    //     {
    //       path: "/register",
    //       method: RequestMethod.POST
    //     }
    //   ).forRoutes("*")
  }
}
