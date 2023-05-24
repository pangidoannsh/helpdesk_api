import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Faq {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    subject: string

    @Column({
        type: 'text'
    })
    description: string;

    @ManyToOne(() => User, user => user.faqCreator, { eager: true, onDelete: 'SET NULL' })
    userCreate: User;

    @ManyToOne(() => User, user => user.faqUpdate, { eager: true, onDelete: 'SET NULL' })
    userUpdate: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}