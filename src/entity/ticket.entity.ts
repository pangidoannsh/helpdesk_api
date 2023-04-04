import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, OneToOne, Generated, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { Feedback } from "./feedback.entity";
import { Fungsi } from "./fungsi.entity";
import { TicketMessage } from "./ticket-message.entity";
import { User } from "./user.entity";

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id: string

    @Column()
    @Generated("uuid")
    slug: string

    @ManyToOne(() => User, user => user.ticketUpdater)
    userUpdate: User

    @ManyToOne(() => User, user => user.ticketOrderer)
    userOrderer: User

    @ManyToOne(() => Category, category => category.ticket, { eager: true })
    category: Category

    @Column({
        length: 50
    })
    fungsi: string;

    @OneToOne(() => Feedback, feedback => feedback.ticket)
    feedback: Feedback

    @Column()
    subject: string

    @Column()
    fileAttachment: string


    @Column({
        type: "enum",
        name: "status",
        nullable: false,
        enumName: "ticket_status",
        enum: ["open", "process", "expired", "done"],
        default: "open"
    })
    status: string

    @Column({
        type: "enum",
        name: "priority",
        nullable: false,
        enumName: "priority_type",
        enum: ["low", "medium", "high"],
        default: "low"
    })
    priority: string

    @Column()
    expiredAt: Date

    @UpdateDateColumn({
        type: "datetime"
    })
    updatedAt: Date

    @CreateDateColumn({
        type: 'datetime'
    })
    createdAt: Date

    @OneToMany(() => TicketMessage, ticketMessage => ticketMessage.ticket)
    ticketMessage: TicketMessage[]
}