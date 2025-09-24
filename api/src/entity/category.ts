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
import { PropertyType } from "./enum";

@Entity()
export class Category {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: string | null | undefined;

    @Column({ default: true })
    name: string;

    @Column({ default: true })
    img_url: string;

    @Column({ default: true })
    status: boolean;

    @CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
    })
    createdAt: Date;
    
  @Column({
        type: "enum",
        enum: PropertyType,
    })
    propertyType: PropertyType;

    @UpdateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: "CURRENT_TIMESTAMP(6)",
    })
    updatedAt: Date;
}