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
export class Booking {
  
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @ManyToOne(() => User, user => user.id, { nullable: false })
  user: User;

  @ManyToOne(() => Property, property => property.id, { nullable: false })
  property: Property;

  @ManyToOne(() => PropertyVariants, variant => variant.id, { nullable: false })
  variant: PropertyVariants;

  // Dates (or timestamps) for reservation
  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'int', default: 1 })
  unitsBooked: number;

  // Computed amounts
  @Column('decimal', { precision: 10, scale: 2 })
  baseAmount: number;         // nightsOrDays × rate

  @Column('decimal', { precision: 10, scale: 2 })
  taxAmount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  extrasAmount: number;       // e.g. extra beds

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;        // sum of above

  @Column({ type: 'enum', enum: PaymentType, default: PaymentType.ONLINE })
  paymentType: PaymentType;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  // Payment gateway fields
  @Column({ length: 255, nullable: true })
  paymentGatewayId: string | null;

  @Column({ length: 255, nullable: true })
  paymentOrderId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}