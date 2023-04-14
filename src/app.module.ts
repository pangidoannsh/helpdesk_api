import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
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
import { ConfigModule } from './module/config/config.module';
import { TimeScheduleModule } from './module/schedule/time-schedule.module';
import { FaqModule } from './module/faq/faq.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }), TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "helpdesk_it_db",
      entities,
      synchronize: true
    }), UserModule, TicketMessageModule, TicketModule, AuthModule, CategoryModule, FeedbackModule, ResponsesModule, FungsiModule,
    ConfigModule, TimeScheduleModule, FaqModule],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
  }
}
