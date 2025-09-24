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
import { User } from "./user";
import { Property } from "./properties";
import { BookingStatus, PaymentType } from "./enum";
import { PropertyVariants } from "./property_veriants";

@Entity()
export class BookingRequest {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @ManyToOne(() => User, user => user.id, { nullable: false })
  user: User;

  @ManyToOne(() => Property, prop => prop.id, { nullable: false })
  property: Property;

  @ManyToOne(() => PropertyVariants, v => v.id, { nullable: false })
  variant: PropertyVariants;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column('int')
  unitsBooked: number;

  @Column('decimal', { precision: 10, scale: 2 })
  baseAmount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  extrasAmount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  taxAmount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'enum', enum: PaymentType })
  paymentType: PaymentType;

  @Column({ length: 255, nullable: true })
  paymentOrderId: string | null;   // Razorpay order ID

  @CreateDateColumn()
  createdAt: Date;
}