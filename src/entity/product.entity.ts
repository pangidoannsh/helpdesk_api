import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100
    })
    name: string;

    @Column({
        type: "enum",
        nullable: false,
        enumName: "product_status",
        enum: ["ready", "used", "repair"],
        default: "ready"
    })
    status: string;

    @UpdateDateColumn({
        type: "datetime"
    })
    updatedAt: Date

    @CreateDateColumn({
        type: 'datetime'
    })
    createdAt: Date
}