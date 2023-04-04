import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { Fungsi } from "./fungsi.entity";
import { RefreshToken } from "./refresh-token.entity";
import { TicketMessage } from "./ticket-message.entity";
import { Ticket } from "./ticket.entity";

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

    @Column({
        type: "bool",
        name: "isActived",
        default: false
    })
    isActived: boolean

    @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
    refreshTokens: RefreshToken[]

    @OneToMany(() => Ticket, ticket => ticket.userUpdate)
    ticketUpdater: Ticket[]

    @OneToMany(() => Ticket, ticket => ticket.userOrderer)
    ticketOrderer: Ticket[]

    @OneToMany(() => TicketMessage, ticketMessage => ticketMessage.userCreated)
    messageCreater: TicketMessage[];

    @Column({
        length: 50
    })
    fungsi: string;
}