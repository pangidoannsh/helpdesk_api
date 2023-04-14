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
}