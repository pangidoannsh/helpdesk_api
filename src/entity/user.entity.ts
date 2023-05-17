import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, OneToOne } from "typeorm";
import { Fungsi } from "./fungsi.entity";
import { RefreshToken } from "./refresh-token.entity";
import { TicketMessage } from "./ticket-message.entity";
import { Ticket } from "./ticket.entity";
import { TimeSchedule } from "./time-schedule.entity";
import { Faq } from "./faq.entity";
import { FungsiSchedule } from "./fungsi-schedule.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn({
        type: "bigint",
        name: "id"
    })
    id: number

    @Column({
        name: "phone",
        nullable: false,
        default: '',
        length: 20,
        unique: true,
        select: false
    })
    phone: string
    @Column({
        select: false,
        name: "password",
        nullable: false
    })
    password: string

    @Column({
        name: "name",
        nullable: false,
        default: ''
    })
    name: string

    @Column({
        type: "enum",
        name: "level",
        nullable: false,
        enumName: "user_role",
        enum: ["pegawai", "agent", "supervisor"],
        default: "pegawai"
    })
    level: string

    @OneToMany(() => RefreshToken, refreshToken => refreshToken.user, { onDelete: 'CASCADE' })
    refreshTokens: RefreshToken[]

    @OneToMany(() => Ticket, ticket => ticket.userUpdate, { onDelete: 'SET NULL' })
    ticketUpdater: Ticket[]

    @OneToMany(() => Ticket, ticket => ticket.userOrderer, { onDelete: 'CASCADE' })
    ticketOrderer: Ticket[]

    @OneToMany(() => TicketMessage, ticketMessage => ticketMessage.userCreated, { onDelete: 'CASCADE' })
    messageCreater: TicketMessage[];

    @OneToMany(() => Faq, faq => faq.userCreate, { onDelete: 'SET NULL' })
    faqCreator: Faq[]

    @OneToMany(() => TimeSchedule, timeSchedule => timeSchedule.agentUser, { onDelete: 'CASCADE' })
    timeSchedule: TimeSchedule[];

    @OneToMany(() => FungsiSchedule, fungsiSchedule => fungsiSchedule.agentUser, { onDelete: 'CASCADE' })
    fungsiSchedule: FungsiSchedule[];

    @ManyToOne(() => Fungsi, fungsi => fungsi.user, { eager: true, onDelete: 'SET NULL' })
    fungsi: Fungsi
}