import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PropertyImage } from './property-image.entity';
import { PropertyType } from '../enums/property-type.enum';
import { OperationType } from '../enums/operation-type.enum';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: PropertyType,
  })
  propertyType: PropertyType;

  @Column({
    type: 'enum',
    enum: OperationType,
  })
  operation: OperationType;

  @OneToMany(() => PropertyImage, (image) => image.property, {
    eager: true,
    cascade: true,
  })
  images: PropertyImage[];

  @Column()
  address: string;

  @Column('decimal', { precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  bedrooms: number;

  @Column({ type: 'int', nullable: true })
  bathrooms: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  builtArea: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  landArea: number;

  @Column({ type: 'int', nullable: true })
  garageSpaces: number;

  @Column({ type: 'int', nullable: true })
  yearBuilt: number;

  @Column('simple-json', { nullable: true })
  features: {
    amenities?: string[];
    location?: string[];
  };

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
