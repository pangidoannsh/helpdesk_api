import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn({
        type: "bigint",
        name: "id"
    })
    id: number

    @Column({
        type: "bigint",
        name: "user_update"
    })
    userUpdate: number

}