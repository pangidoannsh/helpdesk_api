import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { FungsiSchedule } from "./fungsi-schedule.entity";
import { User } from "./user.entity";
import { Ticket } from "./ticket.entity";

@Entity()
export class Fungsi {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50
    })
    name: string;

    @OneToMany(() => FungsiSchedule, fungsiSchedule => fungsiSchedule.fungsi, { onDelete: 'CASCADE' })
    fungsiSchedule: FungsiSchedule[]

    @OneToMany(() => User, user => user.fungsi, { onDelete: 'SET NULL' })
    user: User[]

    @OneToMany(() => Ticket, ticket => ticket.fungsi, { onDelete: 'SET NULL' })
    ticket: Ticket[]

}