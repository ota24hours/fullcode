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
import { Property } from "./properties";
import { PropertyVariants } from "./property_veriants";
import { BoatType } from "./enum";

@Entity()
export class PropertyPricingVariants {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: string | null | undefined;

    @ManyToOne(() => PropertyVariants, (pro_variant) => pro_variant.id, { nullable: true })
    @JoinColumn()
    variant_id: PropertyVariants | null | undefined;

    @Column({ default: true })
    name: string;

    @Column({ default: true })
    startDate: string;


    @Column({ default: true })
    endDate: string;

    @Column({ default: true })
    isActive: boolean;
    
    @Column("decimal", { precision: 10, scale: 2, nullable: true,default:0 })
    rate: number;

 

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