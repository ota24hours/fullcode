import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn
} from "typeorm";
import { User } from "./user";
import { Booking } from "./booking";


@Entity()
export class VendorPayment {
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  id: string;

  // Which vendor (user) this payment goes to
  @ManyToOne(() => User, vendor => vendor.id, { nullable: false })
  @JoinColumn({ name: "vendor_id" })
  vendor: User;

  // (Optional) tie it back to a specific booking

  // The actual amount you “gave” the vendor
  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  amount: number;

  // A short note or reference
  @Column({ length: 255, nullable: true })
  pdf_url: string | null;

  // A short note or reference
  @Column({ length: 255, nullable: true })
  note: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
