import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { PermissionsGuard } from '@common/guards/permissions.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { Permissions } from '@common/decorators/permissions.decorator';
import { Role } from '@common/enums/role.enum';
import { Permission } from '@common/enums/permission.enum';
import { BlogCategory } from './enums/blog-category.enum';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Permissions(Permission.CREATE_BLOG_POST)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new blog post (Admin only)' })
  create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogService.create(createBlogPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blog posts (including drafts)' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.READ_BLOG_POST)
  @ApiBearerAuth('JWT-auth')
  findAll() {
    return this.blogService.findAll();
  }

  @Get('published')
  @ApiOperation({ summary: 'Get all published blog posts (Public)' })
  findPublished() {
    return this.blogService.findPublished();
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured blog posts (Public)' })
  findFeatured() {
    return this.blogService.findFeatured();
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get blog posts by category (Public)' })
  @ApiQuery({ name: 'category', enum: BlogCategory })
  findByCategory(@Param('category') category: BlogCategory) {
    return this.blogService.findByCategory(category);
  }

  @Get('tag/:tag')
  @ApiOperation({ summary: 'Get blog posts by tag (Public)' })
  findByTag(@Param('tag') tag: string) {
    return this.blogService.findByTag(tag);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get blog post by slug (Public)' })
  async findBySlug(@Param('slug') slug: string) {
    const post = await this.blogService.findBySlug(slug);
    await this.blogService.incrementViews(post.id);
    return post;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get blog post by ID' })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.READ_BLOG_POST)
  @ApiBearerAuth('JWT-auth')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.UPDATE_BLOG_POST)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update blog post' })
  update(@Param('id') id: string, @Body() updateBlogPostDto: UpdateBlogPostDto) {
    return this.blogService.update(id, updateBlogPostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Permissions(Permission.DELETE_BLOG_POST)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete blog post (Admin only)' })
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
