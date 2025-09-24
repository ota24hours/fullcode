import { Length } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
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
import { EnquiryReply } from "./enquiry_replay";

@Entity()
export class GeneralEnquiry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: true })
  user: User | null;

  @Column({ length: 255 })
  subject: string;

  @Column('text')
  message: string;

  @Column({ type: 'enum', enum: ['OPEN', 'REPLIED'], default: 'OPEN' })
  status: 'OPEN' | 'REPLIED';

  @OneToMany(() => EnquiryReply, (reply) => reply.enquiry, { cascade: true })
  replies: EnquiryReply[];

  @CreateDateColumn()
  createdAt: Date;
}