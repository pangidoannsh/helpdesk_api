import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ticket } from "./ticket.entity";
import { User } from "./user.entity";

@Entity()
export class TicketHistory {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    status: string

    @ManyToOne(() => Ticket, ticket => ticket.history, { onDelete: 'CASCADE' })
    ticket: Ticket

    @ManyToOne(() => User, user => user.ticketHistoryCreator, { eager: true, onDelete: 'SET NULL' })
    userCreated: User

    @CreateDateColumn()
    createdAt: Date
}