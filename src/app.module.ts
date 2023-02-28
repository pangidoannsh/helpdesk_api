import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './module/user/user.module';
import { TicketModule } from './module/ticket/ticket.module';
import entities from './entity';

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
  }), UserModule, TicketModule]
})
export class AppModule { }
