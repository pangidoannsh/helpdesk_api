import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Ticket } from "./ticket.entity";

@Entity()
export class Category {
    @PrimaryGeneratedColumn({
        type: "bigint",
        name: "id"
    })
    id: number

    @Column()
    categoryName: string

    @Column({
        type: "enum",
        name: 'parentOf',
        nullable: false,
        enumName: "ticket_status",
        enum: ["gangguan", "permintaan"],
        default: "gangguan"
    })
    parentOf: string

    @OneToMany(() => Ticket, ticket => ticket.category, { onDelete: 'CASCADE' })
    ticket: Ticket[]
}