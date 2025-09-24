import { Length } from "class-validator";
import {
    Admin,
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
import { BoatType, PropertyType } from "./enum";
import { Category } from "./category";
import { Sub_Category } from "./sub_category";
import { PropertyImgs } from "./properties_imgs";
import { User } from "./user";
import { PropertyVariants } from "./property_veriants";

@Entity()
export class Property {
    // ─── Primary Key ───────────────────────────────────────────────────────
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: string;

    // ─── Type Discriminator ────────────────────────────────────────────────
    // Determines which “shape” of property this row represents.
    @Column({
        type: "enum",
        enum: PropertyType,
    })
    propertyType: PropertyType;

    @Column({
        type: "enum",
        enum: BoatType,
        default: BoatType.OTHER,
    })
    boat_type: BoatType;

   

    @OneToMany(() => PropertyVariants, (ip) => ip.property_id, { cascade: true })
    property_variants: PropertyVariants[];


    // ─── Common Fields (all property‐types share) ─────────────────────────
    @Column({ length: 255 ,nullable: true })
    name: string;

     // ─── Common Fields (all property‐types share) ─────────────────────────
    @Column({ length: 255 ,nullable: true })
    Included: string;

    @Column({ length: 255 ,nullable: true })
    distances: string;

    @Column({ length: 255 ,nullable: true })
    nearby_attractions: string;

    @Column({ length: 255 ,nullable: true})
    trade_name: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    image: string | null;

    @Column("text", { nullable: true })
    description: string | null;

    @Column("text", { nullable: true })
    termsAndConditions: string | null;

    // For vehicles you might treat this as “price per day,” for rooms “price per night,” etc.
    @Column("decimal", { precision: 10, scale: 2, nullable: true,default:0 })
    rate: number;

    
    
    @Column({ type: "decimal", precision: 9, scale: 6, nullable: true,default:0 })
    latitude: number | null;

    @Column({ type: "decimal", precision: 9, scale: 6, nullable: true,default:0 })
    longitude: number | null;

     @Column({ type: "int",nullable: true })
    totalUnits: number;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: "int", nullable: true })
    capacity: number | null;
    // (E.g. for vehicles: passenger capacity; for rooms/houseboats: max occupants)

    @ManyToOne(() => Category, (catData) => catData.id, { nullable: true })
    @JoinColumn()
    cat_id: Category | null | undefined;

    @ManyToOne(() => Sub_Category, (catData) => catData.id, { nullable: true })
    @JoinColumn()
    sub_cat_id: Sub_Category | null | undefined;

    @ManyToOne(() => User, (user) => user.id, { nullable: true })
    @JoinColumn()
    user_id: User | null | undefined;

    // ─── Vehicle-Specific Fields ──────────────────────────────────────────
    // Only relevant when propertyType = VEHICLE
    @Column({ type: "varchar", length: 100, nullable: true })
    make: string | null;           // e.g. “Toyota”, “Ford”

    @Column({ type: "varchar", length: 100, nullable: true })
    model: string | null;          // e.g. “Innova Crysta”, “Fortuner”

    @Column({ type: "varchar", length: 50, nullable: true })
    registrationNumber: string | null; // e.g. “KA01AB1234”

    @Column({ type: "varchar", length: 50, nullable: true })
    transmission: string | null;   // e.g. “Automatic” / “Manual”

    // ─── Room-Specific Fields (Resort / Hotel) ────────────────────────────
    // Only relevant when propertyType = RESORT_ROOM or HOTEL_ROOM
    @Column({ type: "varchar", length: 50, nullable: true })
    roomNumber: string | null;     // e.g. “502”, “A-203”

    @Column({ type: "int", nullable: true })
    bedCount: number | null;       // e.g. 1, 2, 3

    // Simple array of amenity‐names (e.g. ["WiFi","AC","Breakfast"])
    @Column("simple-array", { nullable: true })
    amenities: string[] | null;

    @Column({ type: "boolean", default: true })
    hasBreakfastIncluded: boolean;


    ///Here Is the New tabs in the riyas ka form aslo its nullable 
  @Column({ type: "varchar", length: 50, nullable: true })
    place: string | null;  

    @Column({ type: "varchar", length: 50, nullable: true })
    district: string | null;  

    @Column({ type: "varchar", length: 50, nullable: true })
    state: string | null;  

    @Column({ type: "varchar", length: 50, nullable: true })
    pincode: string | null;  


 

    // ─── Houseboat-Specific Fields ────────────────────────────────────────
    // Only relevant when propertyType = HOUSE_BOAT
    @Column({ type: "varchar", length: 100, nullable: true })
    boatName: string | null;       // e.g. “MV Kerala Pearl”

    @Column({ type: "varchar", length: 50, nullable: true })
    boatRegistrationNo: string | null; // e.g. “KL-07HB-2021”

    @Column({ type: "boolean", default: false })
    hasDiningFacility: boolean;

    // ── SPECIAL_EVENT‐specific fields ─────────────────────────────────
    // You can define extra columns here or keep them null when propertyType ≠ SPECIAL_EVENT.
    // For example:
    @Column({ type: "timestamp", nullable: true })
    eventStartDate: Date | null;

    @Column({ type: "timestamp", nullable: true })
    eventEndDate: Date | null;

    @Column({ type: "varchar", length: 50, nullable: true })
    eventLocation: string | null; // e.g. “KL-07HB-2021”


    // ─── Timestamps ────────────────────────────────────────────────────────
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: "CURRENT_TIMESTAMP(6)",
    })
    updatedAt: Date;
}