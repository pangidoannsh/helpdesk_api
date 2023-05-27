import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './module/user/user.module';
import { TicketModule } from './module/ticket/ticket.module';
import { AuthModule } from './module/auth/auth.module';
import entities from './entity';
import { CategoryModule } from './module/category/category.module';
import { TicketMessageModule } from './module/ticket-message/ticket-message.module';
import { FeedbackModule } from './module/feedback/feedback.module';
import { ResponsesModule } from './module/responses/responses.module';
import { FungsiModule } from './module/fungsi/fungsi.module';
import { ConfigurationModule } from './module/configuration/configuration.module';
import { TimeScheduleModule } from './module/time-schedule/time-schedule.module';
import { FaqModule } from './module/faq/faq.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from './module/schedule/schedule.module';
import { FungsiScheduleModule } from './module/fungsi-schedule/fungsi-schedule.module';
import { NotificationModule } from './module/notification/notification.module';
import { SystemMiddleware } from './middleware/system.middleware';
import { TicketController } from './module/ticket/ticket.controller';
import { TicketMessageController } from './module/ticket-message/ticket-message.controller';
import { TicketHistoryModule } from './module/ticket-history/ticket-history.module';
import { TicketAssignmentModule } from './module/ticket-assignment/ticket-assignment.module';
import { AppController } from './app.controller';
import { UserController } from './module/user/user.controller';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "helpdesk_it_db",
      entities,
      synchronize: true
    }),
    UserModule,
    TicketMessageModule,
    TicketModule,
    AuthModule,
    CategoryModule,
    FeedbackModule,
    ResponsesModule,
    FungsiModule,
    ConfigurationModule,
    TimeScheduleModule,
    FaqModule,
    ScheduleModule,
    FungsiScheduleModule,
    NotificationModule,
    TicketHistoryModule,
    TicketAssignmentModule
  ],
  controllers: [AppController]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SystemMiddleware)
      .forRoutes(TicketController, TicketMessageController)
  }
}
