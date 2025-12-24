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
  @IsString({ message: 'El título debe ser un texto válido' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MinLength(10, { message: 'El título debe tener al menos 10 caracteres' })
  @MaxLength(200, { message: 'El título no puede exceder 200 caracteres' })
  title: string;

  @ApiProperty({
    example: 'guia-completa-comprar-primera-propiedad',
    required: false,
    description: 'URL-friendly slug. Si no se proporciona, se genera automáticamente del título',
  })
  @IsString({ message: 'El slug debe ser un texto válido' })
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 'https://example.com/cover-image.jpg' })
  @IsString({ message: 'La imagen de portada debe ser una URL válida' })
  @IsNotEmpty({ message: 'La imagen de portada es obligatoria' })
  coverImage: string;

  @ApiProperty({ enum: BlogCategory, example: BlogCategory.GUIDE })
  @IsEnum(BlogCategory, { message: 'La categoría debe ser una de las opciones válidas' })
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  category: BlogCategory;

  @ApiProperty({
    example: '<p>Contenido del artículo en HTML...</p>',
    description: 'Contenido en formato HTML enriquecido',
  })
  @IsString({ message: 'El contenido debe ser un texto válido' })
  @IsNotEmpty({ message: 'El contenido es obligatorio' })
  @MinLength(100, { message: 'El contenido debe tener al menos 100 caracteres' })
  content: string;

  @ApiProperty({
    example: 'Aprende todo lo necesario para comprar tu primera propiedad sin complicaciones.',
    required: false,
    description: 'Resumen corto del artículo (150-200 caracteres)',
  })
  @IsString({ message: 'El extracto debe ser un texto válido' })
  @IsOptional()
  @MaxLength(300, { message: 'El extracto no puede exceder 300 caracteres' })
  excerpt?: string;

  @ApiProperty({
    enum: BlogStatus,
    example: BlogStatus.DRAFT,
    required: false,
    default: BlogStatus.DRAFT,
  })
  @IsEnum(BlogStatus, { message: 'El estado debe ser una de las opciones válidas' })
  @IsOptional()
  status?: BlogStatus;

  @ApiProperty({
    example: '2024-12-31T10:00:00Z',
    required: false,
    description: 'Fecha programada para publicación automática',
  })
  @IsDateString({}, { message: 'La fecha de programación debe ser una fecha válida' })
  @IsOptional()
  scheduledFor?: Date;

  @ApiProperty({
    example: 'user-uuid-123',
    description: 'ID del autor del post',
  })
  @IsString({ message: 'El ID del autor debe ser un texto válido' })
  @IsNotEmpty({ message: 'El ID del autor es obligatorio' })
  authorId: string;

  @ApiProperty({
    example: 'Guía completa con todos los pasos para comprar tu primera propiedad en Uruguay',
    required: false,
    description: 'Meta descripción para SEO (150-160 caracteres recomendados)',
  })
  @IsString({ message: 'La meta descripción debe ser un texto válido' })
  @IsOptional()
  @MaxLength(160, { message: 'La meta descripción no puede exceder 160 caracteres' })
  metaDescription?: string;

  @ApiProperty({
    example: ['montevideo', 'compra', 'guía', 'primera-vivienda'],
    required: false,
    description: 'Etiquetas para clasificación y búsqueda',
  })
  @IsArray({ message: 'Las etiquetas deben ser un array' })
  @IsString({ each: true, message: 'Cada etiqueta debe ser un texto válido' })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    example: false,
    required: false,
    default: false,
    description: 'Marcar como post destacado',
  })
  @IsBoolean({ message: 'El campo destacado debe ser verdadero o falso' })
  @IsOptional()
  isFeatured?: boolean;
}
