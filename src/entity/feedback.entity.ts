import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Ticket } from "./ticket.entity";


@Entity()
export class Feedback {
    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id: number

    @OneToOne(() => Ticket, ticket => ticket.feedback)
    @JoinColumn()
    ticket: Ticket

    @Column()
    detail: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}