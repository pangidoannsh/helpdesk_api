import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Ticket } from "./ticket.entity";
import { User } from "./user.entity";


@Entity()
export class Feedback {
    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id: number

    @OneToOne(() => Ticket, ticket => ticket.feedback, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn()
    ticket: Ticket

    @Column({
        nullable: false,
        default: 0
    })
    value: number

    @Column()
    comment: string

    @ManyToOne(() => User, user => user.feedbackCreator, { eager: true, onDelete: 'CASCADE' })
    userCreate: User

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}