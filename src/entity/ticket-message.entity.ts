import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ticket } from "./ticket.entity";
import { User } from "./user.entity";

@Entity()
export class TicketMessage {
    @PrimaryGeneratedColumn({
        type: "bigint",
        name: "id"
    })
    id: number

    @ManyToOne(() => User, user => user.messageCreater, { eager: true })
    userCreated: User;

    @ManyToOne(() => Ticket, ticket => ticket.ticketMessage, { eager: true, onDelete: 'CASCADE' })
    ticket: Ticket

    @Column({
        type: "text"
    })
    content: string;

    @CreateDateColumn({
        type: "datetime"
    })
    createdAt: Date;
}