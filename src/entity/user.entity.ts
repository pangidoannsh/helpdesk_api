import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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
        length: 20
    })
    phone: string
    @Column({
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
        name: "role",
        nullable: false,
        enumName: "user_role",
        enum: ["pegawai", "agent", "supervisor"],
        default: "pegawai"
    })
    role: string
    @Column({
        type: "bool",
        name: "isActived",
        default: false
    })
    isActived: boolean
}