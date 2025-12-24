import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Permission } from '@common/enums/permission.enum';
import { User } from '@modules/users/entities/user.entity';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('simple-array', { nullable: true })
  permissions: Permission[];

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
