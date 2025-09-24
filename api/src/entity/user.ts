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
  Point,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { v1 as uuidv1 } from "uuid";
import { Gender, USER_TYPE, VENDOR_VERIFICATION_STATUS } from "./enum";
import { UserSelectCategories } from "./user_select_categories";
import { UserSupportingDocuments } from "./user_supporting_docs";

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  id: string | null | undefined;

  @Column()
  name: string;

  @Column({ unique: true })
  phone: string;

  // @Column({ nullable: false })
  // password: string;

  @Column({ nullable: true })
  secodary_name: string;

  @Column({ unique: true, nullable: true })
  secodary_phone: string;

  @OneToMany(() => UserSupportingDocuments, (ip) => ip.user_id, { cascade: true })
  user_support_docs: UserSupportingDocuments[];


  @Column({ nullable: true, unique: true })
  email: string; // Optional and unique

  ///Bank Account Details

  @Column({ nullable: true, unique: true })
  bank_name: string;
  
  @Column({ nullable: true, unique: true })
  branch_name: string;

  @Column({ nullable: true, unique: true })
  ifsc: string;

  @Column({ nullable: true, unique: true })
  acnt_nmbr: string;

  
    /// End Bank Account Details


  @Column({ nullable: true })
  code: string;

  @Column({ default: true })
  status: boolean;

  @Column({ nullable: true })
  age: string;

  // ─── New verification fields ─────────────────────────────────────────────
  @Column({
    type: "boolean",
    nullable: true,
    default: false,
  })
  verified: boolean;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    default: null,
  })
  verified_by: string | null;

  @Column({
    type: "timestamp",
    nullable: true,
    default: null,
  })
  verified_at: Date | null;

  @Column({
    type: "enum",
    enum: VENDOR_VERIFICATION_STATUS,
    default: VENDOR_VERIFICATION_STATUS.PENDING,
  })
  verified_status: VENDOR_VERIFICATION_STATUS;
  // ────────────────────────────────────────────────────────────────────────

  @OneToMany(() => UserSelectCategories, (ip) => ip.user_id, { cascade: true })
  userSelectedCategories: UserSelectCategories[];

  @Column({
    type: "enum",
    enum: USER_TYPE,
    default: USER_TYPE.OTHER,
  })
  user_type: USER_TYPE;

  @Column({ nullable: true })
  pincode: string;

  @Column({ nullable: true })
  thaluk: string;

  @Column({ nullable: true })
  supporting_document: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  otp: number;

  @Column({ nullable: true })
  api_key: string;


  @Column({ nullable: true })
  fcm_token: string;

  @Column({ nullable: true })
  profile_url: string;

  @Column({ nullable: true })
  address: string;

  @Column({
    type: "enum",
    enum: Gender,
    default: Gender.OTHER,
    nullable: true
  })
  gender: Gender;

  @Column({ nullable: true })
  date_of_birth: string;

  @Column({ nullable: true })
  gst: string;

  @Column({
    type: "geometry",
    spatialFeatureType: "Point",
    srid: 4326,
    nullable: true,
  })
  location: Point | null;

  @Column({ default: true })
  active_status: boolean;

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
