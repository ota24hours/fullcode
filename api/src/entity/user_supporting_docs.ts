import { Length } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { v1 as uuidv1 } from "uuid";
import { Category } from "./category";
import { Sub_Category } from "./sub_category";
import { User } from "./user";


@Entity()
export class UserSupportingDocuments {

    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: string | null | undefined;

    @ManyToOne(() => User, (userData) => userData.id, { nullable: true })
    @JoinColumn()
    user_id: User | null | undefined;

    @Column({ default: true })
    doc_type: string;

    @Column({ nullable: true })
    doc_one: string;

    @Column({ nullable: true })
    expiry_date: Date;

    @CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: "CURRENT_TIMESTAMP(6)",
    })
    updatedAt: Date;
}