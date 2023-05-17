import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class TimeSchedule {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.timeSchedule, { eager: true, onDelete: 'CASCADE' })
    agentUser: User;

    @Column({
        nullable: true
    })
    dutyTime: Date
}