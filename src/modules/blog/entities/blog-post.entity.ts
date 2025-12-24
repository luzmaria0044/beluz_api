import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { BlogCategory } from '../enums/blog-category.enum';
import { BlogStatus } from '../enums/blog-status.enum';

@Entity('blog_posts')
export class BlogPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column('longtext')
  coverImage: string;

  @Column({
    type: 'enum',
    enum: BlogCategory,
  })
  category: BlogCategory;

  @Column('text')
  content: string;

  @Column('text', { nullable: true })
  excerpt: string;

  @Column({
    type: 'enum',
    enum: BlogStatus,
    default: BlogStatus.DRAFT,
  })
  status: BlogStatus;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  scheduledFor: Date;

  @ManyToOne(() => User, { eager: true })
  author: User;

  @Column({ nullable: true })
  metaDescription: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({ type: 'int', nullable: true })
  readingTime: number;

  @Column({ type: 'int', default: 0 })
  views: number;

  @Column({ default: false })
  isFeatured: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  calculateReadingTime() {
    if (this.content) {
      const wordsPerMinute = 200;
      const textContent = this.content.replace(/<[^>]*>/g, '');
      const wordCount = textContent.split(/\s+/).length;
      this.readingTime = Math.ceil(wordCount / wordsPerMinute);
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  setPublishedDate() {
    if (this.status === BlogStatus.PUBLISHED && !this.publishedAt) {
      this.publishedAt = new Date();
    }
  }
}
