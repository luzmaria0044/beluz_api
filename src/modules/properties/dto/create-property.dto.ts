import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  Min,
  IsObject,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PropertyType } from '../enums/property-type.enum';
import { OperationType } from '../enums/operation-type.enum';

class PropertyImageDto {
  @ApiProperty({ example: 'https://example.com/image1.jpg' })
  @IsString({ message: 'La URL de la imagen debe ser un texto válido' })
  @IsNotEmpty({ message: 'La URL de la imagen es obligatoria' })
  url: string;

  @ApiProperty({ example: 0 })
  @IsNumber({}, { message: 'El orden debe ser un número' })
  @IsOptional()
  order?: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean({ message: 'El campo isCover debe ser verdadero o falso' })
  @IsOptional()
  isCover?: boolean;
}

class PropertyFeaturesDto {
  @ApiProperty({
    example: [
      'Piscina climatizada',
      'Quincho con parrillero',
      'Aire acondicionado central',
    ],
    required: false,
  })
  @IsArray({ message: 'Las amenidades deben ser un array' })
  @IsString({ each: true, message: 'Cada amenidad debe ser un texto válido' })
  @IsOptional()
  amenities?: string[];

  @ApiProperty({
    example: ['Cerca de colegios', 'A 5 min de la rambla', 'Zona residencial'],
    required: false,
  })
  @IsArray({ message: 'Las características de ubicación deben ser un array' })
  @IsString({ each: true, message: 'Cada característica de ubicación debe ser un texto válido' })
  @IsOptional()
  location?: string[];
}

export class CreatePropertyDto {
  @ApiProperty({ example: 'Casa Moderna en Carrasco' })
  @IsString({ message: 'El título debe ser un texto válido' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MinLength(5, { message: 'El título debe tener al menos 5 caracteres' })
  @MaxLength(200, { message: 'El título no puede exceder 200 caracteres' })
  title: string;

  @ApiProperty({
    example: 'Hermosa casa con todas las comodidades',
    required: false,
  })
  @IsString({ message: 'La descripción debe ser un texto válido' })
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: PropertyType, example: PropertyType.HOUSE })
  @IsEnum(PropertyType, { message: 'El tipo de propiedad debe ser una de las opciones válidas' })
  @IsNotEmpty({ message: 'El tipo de propiedad es obligatorio' })
  propertyType: PropertyType;

  @ApiProperty({ enum: OperationType, example: OperationType.SALE })
  @IsEnum(OperationType, { message: 'El tipo de operación debe ser una de las opciones válidas' })
  @IsNotEmpty({ message: 'El tipo de operación es obligatorio' })
  operation: OperationType;

  @ApiProperty({
    type: [PropertyImageDto],
    example: [
      { url: 'https://example.com/image1.jpg', order: 0, isCover: true },
      { url: 'https://example.com/image2.jpg', order: 1, isCover: false },
    ],
  })
  @IsArray({ message: 'Las imágenes deben ser un array' })
  @ValidateNested({ each: true })
  @Type(() => PropertyImageDto)
  @ArrayMinSize(1, { message: 'Debe incluir al menos 1 imagen' })
  @ArrayMaxSize(20, { message: 'No puede incluir más de 20 imágenes' })
  images: PropertyImageDto[];

  @ApiProperty({ example: 'Av. Bolivia 1234, Carrasco' })
  @IsString({ message: 'La dirección debe ser un texto válido' })
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  @MinLength(5, { message: 'La dirección debe tener al menos 5 caracteres' })
  address: string;

  @ApiProperty({ example: 450000 })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsNotEmpty({ message: 'El precio es obligatorio' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  price: number;

  @ApiProperty({ example: 3 })
  @IsNumber({}, { message: 'Las habitaciones deben ser un número' })
  @IsNotEmpty({ message: 'Las habitaciones son obligatorias' })
  @Min(0, { message: 'Las habitaciones no pueden ser negativas' })
  bedrooms: number;

  @ApiProperty({ example: 2, required: false })
  @IsNumber({}, { message: 'Los baños deben ser un número' })
  @IsOptional()
  @Min(0, { message: 'Los baños no pueden ser negativos' })
  bathrooms?: number;

  @ApiProperty({ example: 150, required: false })
  @IsNumber({}, { message: 'El área construida debe ser un número' })
  @IsOptional()
  @Min(0, { message: 'El área construida no puede ser negativa' })
  builtArea?: number;

  @ApiProperty({ example: 300, required: false })
  @IsNumber({}, { message: 'El área de terreno debe ser un número' })
  @IsOptional()
  @Min(0, { message: 'El área de terreno no puede ser negativa' })
  landArea?: number;

  @ApiProperty({ example: 2, required: false })
  @IsNumber({}, { message: 'Los espacios de garaje deben ser un número' })
  @IsOptional()
  @Min(0, { message: 'Los espacios de garaje no pueden ser negativos' })
  garageSpaces?: number;

  @ApiProperty({ example: 2020, required: false })
  @IsNumber({}, { message: 'El año de construcción debe ser un número' })
  @IsOptional()
  @Min(1800, { message: 'El año de construcción debe ser 1800 o posterior' })
  yearBuilt?: number;

  @ApiProperty({ type: PropertyFeaturesDto, required: false })
  @IsObject({ message: 'Las características deben ser un objeto' })
  @ValidateNested()
  @Type(() => PropertyFeaturesDto)
  @IsOptional()
  features?: PropertyFeaturesDto;
}
