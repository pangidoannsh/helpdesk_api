import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Fungsi } from "./fungsi.entity";

@Entity()
export class FungsiSchedule {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.fungsiSchedule, { eager: true, onDelete: 'CASCADE' })
    agentUser: User;

    @ManyToOne(() => Fungsi, fungsi => fungsi.fungsiSchedule, { eager: true, onDelete: 'CASCADE' })
    fungsi: Fungsi
}