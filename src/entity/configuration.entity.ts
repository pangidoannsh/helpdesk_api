import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Configuration {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        nullable: false,
        enumName: 'base_schedule',
        enum: ["time", "fungsi"],
        default: "time"
    })
    BaseScheduleAgent: string;

    @Column({
        type: "enum",
        nullable: false,
        enumName: 'base_schedule',
        enum: ["ready", "maintenance"],
        default: "maintenance"
    })
    systemMode: string;

    @Column({
        default: true,
        type: 'bool'
    })
    isSendWhatsapp: boolean

    @Column({
        default: true,
        type: 'bool'
    })
    isSendEmail: boolean;

    @Column({
        default: 1
    })
    ticketDeadline: number
}