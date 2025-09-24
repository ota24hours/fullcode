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
import { Booking } from "./booking";
import { BookingDispute } from "./booking_dispute";
import { GeneralEnquiry } from "./general_enquiry";

@Entity()
export class EnquiryReply {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => GeneralEnquiry, (enquiry) => enquiry.replies)
  enquiry: GeneralEnquiry;

  @Column('text')
  message: string;

  @Column({ type: 'timestamp' })
  repliedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}