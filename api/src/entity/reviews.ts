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
import { Property } from "./properties";
import { User } from "./user";
import { Category } from "./category";
import { StarRating } from "./enum";

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @ManyToOne(() => Property, { nullable: false })
  property: Property;

  @ManyToOne(() => Category, { nullable: false })
  category: Category;

   @Column({ type: 'text', nullable: true })
  rating: string;

  @Column({
  type: 'text',
  nullable: true,
  charset: 'utf8mb4',
  collation: 'utf8mb4_unicode_ci'
})
comment: string;

  @CreateDateColumn()
  createdAt: Date;
}