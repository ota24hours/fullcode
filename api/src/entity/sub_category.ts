
import { Length } from "class-validator";
import {
    Admin,
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

@Entity()
export class Sub_Category {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: string | null | undefined;

    @Column({ default: true })
    name: string;

    @ManyToOne(() => Category, (catData) => catData.id, { nullable: true })
    @JoinColumn()
    cat_id: Category | null | undefined;

    @Column({ default: true })
    status: boolean;

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