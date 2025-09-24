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
export class UserSelectCategories {

    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: string | null | undefined;

    @ManyToOne(() => Category, (catData) => catData.id, { nullable: true })
    @JoinColumn()
    cat_id: Category | null | undefined;

    @ManyToOne(() => User, (userData) => userData.id, { nullable: true })
    @JoinColumn()
    user_id: User | null | undefined;

    @ManyToOne(() => Sub_Category, (sub_cat) => sub_cat.id, { nullable: true })
    @JoinColumn()
    sub_cat_id: Sub_Category | null | undefined;

    @Column({ default: true })
    name: string;

    @Column({ default: true })
    place: string;

    @Column({ default: true })
    license_no: string;

    @Column({ default: true })
    vehicle_no: string;

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
