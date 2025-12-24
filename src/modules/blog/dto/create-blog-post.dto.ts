import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsBoolean,
  IsDateString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BlogCategory } from '../enums/blog-category.enum';
import { BlogStatus } from '../enums/blog-status.enum';

export class CreateBlogPostDto {
  @ApiProperty({ example: 'Guía completa para comprar tu primera propiedad' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    example: 'guia-completa-comprar-primera-propiedad',
    required: false,
    description: 'URL-friendly slug. Si no se proporciona, se genera automáticamente del título',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 'https://example.com/cover-image.jpg' })
  @IsString()
  @IsNotEmpty()
  coverImage: string;

  @ApiProperty({ enum: BlogCategory, example: BlogCategory.GUIDE })
  @IsEnum(BlogCategory)
  @IsNotEmpty()
  category: BlogCategory;

  @ApiProperty({
    example: '<p>Contenido del artículo en HTML...</p>',
    description: 'Contenido en formato HTML enriquecido',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(100)
  content: string;

  @ApiProperty({
    example: 'Aprende todo lo necesario para comprar tu primera propiedad sin complicaciones.',
    required: false,
    description: 'Resumen corto del artículo (150-200 caracteres)',
  })
  @IsString()
  @IsOptional()
  @MaxLength(300)
  excerpt?: string;

  @ApiProperty({
    enum: BlogStatus,
    example: BlogStatus.DRAFT,
    required: false,
    default: BlogStatus.DRAFT,
  })
  @IsEnum(BlogStatus)
  @IsOptional()
  status?: BlogStatus;

  @ApiProperty({
    example: '2024-12-31T10:00:00Z',
    required: false,
    description: 'Fecha programada para publicación automática',
  })
  @IsDateString()
  @IsOptional()
  scheduledFor?: Date;

  @ApiProperty({
    example: 'user-uuid-123',
    description: 'ID del autor del post',
  })
  @IsString()
  @IsNotEmpty()
  authorId: string;

  @ApiProperty({
    example: 'Guía completa con todos los pasos para comprar tu primera propiedad en Uruguay',
    required: false,
    description: 'Meta descripción para SEO (150-160 caracteres recomendados)',
  })
  @IsString()
  @IsOptional()
  @MaxLength(160)
  metaDescription?: string;

  @ApiProperty({
    example: ['montevideo', 'compra', 'guía', 'primera-vivienda'],
    required: false,
    description: 'Etiquetas para clasificación y búsqueda',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    example: false,
    required: false,
    default: false,
    description: 'Marcar como post destacado',
  })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
