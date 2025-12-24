import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Property } from './property.entity';

@Entity('property_images')
export class PropertyImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ default: 0 })
  order: number;

  @Column({ default: false })
  isCover: boolean;

  @ManyToOne(() => Property, (property) => property.images, {
    onDelete: 'CASCADE',
  })
  property: Property;

  @CreateDateColumn()
  createdAt: Date;
}
