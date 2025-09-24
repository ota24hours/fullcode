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
import { Property } from "./properties";
import { PropertyImgs } from "./properties_imgs";
import { PropertyPricingVariants } from "./pricing_variants";
import { BoatType } from "./enum";

@Entity()
export class PropertyVariants {
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  id: string | null | undefined;

  @ManyToOne(() => Property, (property) => property.id, { nullable: true })
  @JoinColumn()
  property_id: Property | null | undefined;

  @Column({ length: 255 })
  name: string;

  @Column("decimal", { precision: 10, scale: 2, nullable: true, default: 0 })
  rate: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true, default: 0 })
  min_rate: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true, default: 0 })
  waiting_rate: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true, default: 0 })
  daily_rate: number;

  @OneToMany(() => PropertyImgs, (ip) => ip.variant_id, { cascade: true })
  propertyImgs: PropertyImgs[];

      @Column({
            type: "enum",
            enum: BoatType,
            default: BoatType.OTHER,
        })
        boat_type: BoatType;


  @OneToMany(() => PropertyPricingVariants, (ip) => ip.variant_id, { cascade: true })
  propertyPricing: PropertyPricingVariants[];

  @Column("decimal", { precision: 10, scale: 2, nullable: true,default:0 })
    percentage: number;

  // ─── New JSON field ────────────────────────────────────────────────────────
  // @Column("json", { default: [] })
  // extraData: any;
  @Column({
    type: "json",
    nullable: false,
    default: () => "'[]'",
  })
  extraData: any[];

  @Column({
    type: "json",
    nullable: false,
    default: () => "'[]'",
  })
  detailsData: any[];


  @Column("decimal", { precision: 10, scale: 2, nullable: true, default: 0 })
  tax: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true, default: 0 })
  max_person: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true, default: 0 })
  child_count: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true, default: 0 })
  total_units_available: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true, default: 0 })
  person_allowed: number;

  @Column({ default: true })
  extra_bed_available: boolean;

  @Column("decimal", { precision: 10, scale: 2, nullable: true, default: 0 })
  rate_for_extra_bed: number;


  @Column({ default: true })
  img_url: string;

  //New Fields
  @Column({ default: true })
  capacity: string;

  @Column({ default: true })
  staff: string;

  @Column({ default: true })
  lifeBoys: string;

  @Column({ default: true })
  lifeJacket: string;

  @Column({ default: true })
  boat_material: string;

  @Column({ default: true })
  fire_safety: string;

  ///New fields

  @Column({ default: true, nullable: true })
  emergency_number: string;

  @Column({ default: true, nullable: true })
  capacity_transport: string;

  @Column({ default: true, nullable: true })
  vehicle_number: string;

  @Column({ default: true, nullable: true })
  permit_expiry: string;

  @Column({ default: true, nullable: true })
  fitness_expiry: string;

  @Column({ default: true, nullable: true })
  rc_number: string;

  @Column({ default: true, nullable: true })
  rc_expiry: string;

  @Column({ default: true, nullable: true })
  puc_number: string;

  @Column({ default: true, nullable: true })
  puc_expiry: string;

  @Column({ default: true, nullable: true })
  insurance_number: string;

  @Column({ default: true, nullable: true })
  insurance_expiry: string;

  @Column({ default: true, nullable: true })
  details: string;

  @Column({ default: true, nullable: true })
  fitness_number: string;

  @Column({ default: true, nullable: true })
  permit_number: string;

  //New fields

  @Column({ default: true, nullable: true })
  one_day_min_rate: string;

  @Column({ default: true, nullable: true })
  one_day_included_km: string;

  @Column({ default: true, nullable: true })
  one_day_included_hours: string;

  @Column({ default: true, nullable: true })
  one_day_add_km: string;

  @Column({ default: true, nullable: true })
  one_day_add_hr: string;

  @Column({ default: true, nullable: true })
  one_day_bata: string;

  @Column({ default: true, nullable: true })
  two_day_min_rate: string;

  @Column({ default: true, nullable: true })
  two_day_included_km: string;

  @Column({ default: true, nullable: true })
  two_day_included_hours: string;

  @Column({ default: true, nullable: true })
  two_day_add_km: string;

  @Column({ default: true, nullable: true })
  two_day_add_hr: string;

  @Column({ default: true, nullable: true })
  two_day_bata: string;

  @Column({ default: true, nullable: true })
  three_day_min_rate: string;

  @Column({ default: true, nullable: true })
  three_day_included_km: string;

  @Column({ default: true, nullable: true })
  three_day_included_hours: string;

  @Column({ default: true, nullable: true })
  three_day_add_km: string;

  ///New fields

  @Column({ default: true, nullable: true })
  dinner_rate: string;

  @Column({ default: true, nullable: true })
  lunch_rate: string;

  @Column({ default: true, nullable: true })
  breakfast_rate: string;

  @Column({ default: true, nullable: true })
  extra_hour_rate: string;

   @Column({ default: true, nullable: true })
  extra_person_rate: string;

  @Column({ default: true, nullable: true })
  three_day_add_hr: string;

  @Column({ default: true, nullable: true })
  three_day_bata: string;

  @Column({ default: true, nullable: true })
  event_time: string;

  @Column({ default: true, nullable: true })
  event_date: string;

      @Column({ type: "varchar", length: 50, nullable: true })
    additional_rate_km: string | null;  

    @Column({ type: "varchar", length: 50, nullable: true })
    km_min_rate: string | null; 



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