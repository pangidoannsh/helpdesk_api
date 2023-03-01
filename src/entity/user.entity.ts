import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { RefreshToken } from "./refresh-token.entity";

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

    @OneToMany(() => RefreshToken, refreshToken => refreshToken.user, { eager: true })
    refreshTokens: RefreshToken[]

}