import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ticket } from "./ticket.entity";
import { User } from "./user.entity";

@Entity()
export class TicketAssignment {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Ticket, ticket => ticket.assignment, { onDelete: 'CASCADE' })
    ticket: Ticket

    @ManyToOne(() => User, user => user.ticketAssignment, { eager: true })
    user: User
}