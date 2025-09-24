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
import { Gender } from "./enum";


@Entity()
export class Admin {
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  id: string | null | undefined;

  @Column({ unique: true, nullable: false })
  user_name: string;

  @Column({ default: true })
  name: string;

  @Column({ nullable: true })
  phone_no: string;

  @Column({ nullable: true })
  apiKey: string;

  @Column({ default: true })
  status: boolean;

  @Column({ nullable: false })
  password: string;

  @Column({ default: false })
  is_super_admin: boolean;

  @Column({ nullable: true })
  api_key: string;

  @ManyToOne(() => Admin, { nullable: true })
  createdBy: Admin | null;

  @Column({
    type: "enum",
    enum: Gender,
    default: Gender.OTHER,
  })
  gender: Gender;

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
