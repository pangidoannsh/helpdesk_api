import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, PrimaryColumn, Generated } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class RefreshToken {
    @PrimaryColumn({ type: 'uuid' })
    @Generated('uuid')
    id: string;

    @Column({
        default: false
    })
    isRevoked: boolean;

    @Column()
    expiredAt: Date;

    @ManyToOne(() => User, user => user.refreshTokens, { eager: true, onDelete: 'CASCADE' })
    user: User;
}