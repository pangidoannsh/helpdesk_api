import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        default: false
    })
    isRevoked: boolean;

    @Column()
    expiredAt: Date;

    @ManyToOne(() => User, user => user.refreshTokens)
    user: User;
}