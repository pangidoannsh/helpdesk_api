import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Responses {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @CreateDateColumn({
        type: 'datetime',
        select: false
    })
    createdAt: Date

    @UpdateDateColumn({
        type: "datetime",
        select: false
    })
    updatedAt: Date
}