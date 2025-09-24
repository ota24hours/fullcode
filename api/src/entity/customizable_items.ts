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
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { v1 as uuidv1 } from "uuid";
import { CommissionStatus, CustomizationType, MainOptions, PropertyType } from "./enum";
import { Property } from "./properties";


@Entity()
export class CustomizableItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: true })
  name: string;

  @Column({ default: true })
  icon_url: string;


  @Column({ default: true })
  status: boolean;

  @Column({
    type: "enum",
    enum: MainOptions,
    default: MainOptions.OTHER,
    
  })
  mainOptions: MainOptions;

  @Column({
    type: "enum",
    enum: PropertyType,
  })
  propertyType: PropertyType;


  @Column({
    type: "enum",
    enum: CustomizationType,
  })
  customItem: CustomizationType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}