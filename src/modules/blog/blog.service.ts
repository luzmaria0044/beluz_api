import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { User } from '@modules/users/entities/user.entity';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { BlogStatus } from './enums/blog-status.enum';
import { BlogCategory } from './enums/blog-category.enum';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createBlogPostDto: CreateBlogPostDto): Promise<BlogPost> {
    const author = await this.userRepository.findOne({
      where: { id: createBlogPostDto.authorId },
    });

    if (!author) {
      throw new NotFoundException(
        `Author with ID ${createBlogPostDto.authorId} not found`,
      );
    }

    let slug = createBlogPostDto.slug;
    if (!slug) {
      slug = this.generateSlug(createBlogPostDto.title);
    }

    const existingPost = await this.blogPostRepository.findOne({
      where: { slug },
    });

    if (existingPost) {
      throw new ConflictException(`Slug "${slug}" already exists`);
    }

    if (
      createBlogPostDto.status === BlogStatus.SCHEDULED &&
      !createBlogPostDto.scheduledFor
    ) {
      throw new BadRequestException(
        'scheduledFor date is required when status is SCHEDULED',
      );
    }

    const blogPost = this.blogPostRepository.create({
      ...createBlogPostDto,
      slug,
      author,
    });

    return this.blogPostRepository.save(blogPost);
  }

  async findAll(): Promise<BlogPost[]> {
    return this.blogPostRepository.find({
      relations: ['author'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findPublished(): Promise<BlogPost[]> {
    return this.blogPostRepository.find({
      where: { status: BlogStatus.PUBLISHED },
      relations: ['author'],
      order: {
        publishedAt: 'DESC',
      },
    });
  }

  async findFeatured(): Promise<BlogPost[]> {
    return this.blogPostRepository.find({
      where: {
        status: BlogStatus.PUBLISHED,
        isFeatured: true,
      },
      relations: ['author'],
      order: {
        publishedAt: 'DESC',
      },
    });
  }

  async findByCategory(category: BlogCategory): Promise<BlogPost[]> {
    return this.blogPostRepository.find({
      where: {
        category,
        status: BlogStatus.PUBLISHED,
      },
      relations: ['author'],
      order: {
        publishedAt: 'DESC',
      },
    });
  }

  async findBySlug(slug: string): Promise<BlogPost> {
    const post = await this.blogPostRepository.findOne({
      where: { slug },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Blog post with slug "${slug}" not found`);
    }

    return post;
  }

  async findOne(id: string): Promise<BlogPost> {
    const post = await this.blogPostRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    return post;
  }

  async update(
    id: string,
    updateBlogPostDto: UpdateBlogPostDto,
  ): Promise<BlogPost> {
    const post = await this.findOne(id);

    if (updateBlogPostDto.slug && updateBlogPostDto.slug !== post.slug) {
      const existingPost = await this.blogPostRepository.findOne({
        where: { slug: updateBlogPostDto.slug },
      });

      if (existingPost) {
        throw new ConflictException(
          `Slug "${updateBlogPostDto.slug}" already exists`,
        );
      }
    }

    if (updateBlogPostDto.authorId) {
      const author = await this.userRepository.findOne({
        where: { id: updateBlogPostDto.authorId },
      });

      if (!author) {
        throw new NotFoundException(
          `Author with ID ${updateBlogPostDto.authorId} not found`,
        );
      }

      post.author = author;
    }

    if (
      updateBlogPostDto.status === BlogStatus.SCHEDULED &&
      !updateBlogPostDto.scheduledFor &&
      !post.scheduledFor
    ) {
      throw new BadRequestException(
        'scheduledFor date is required when status is SCHEDULED',
      );
    }

    Object.assign(post, updateBlogPostDto);
    return this.blogPostRepository.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    await this.blogPostRepository.remove(post);
  }

  async incrementViews(id: string): Promise<void> {
    await this.blogPostRepository.increment({ id }, 'views', 1);
  }

  async findByTag(tag: string): Promise<BlogPost[]> {
    const posts = await this.blogPostRepository
      .createQueryBuilder('post')
      .where('post.status = :status', { status: BlogStatus.PUBLISHED })
      .andWhere('post.tags LIKE :tag', { tag: `%${tag}%` })
      .leftJoinAndSelect('post.author', 'author')
      .orderBy('post.publishedAt', 'DESC')
      .getMany();

    return posts;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
