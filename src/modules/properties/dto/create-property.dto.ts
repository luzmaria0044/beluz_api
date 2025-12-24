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
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PropertyType } from '../enums/property-type.enum';
import { OperationType } from '../enums/operation-type.enum';

class PropertyImageDto {
  @ApiProperty({ example: 'https://example.com/image1.jpg' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: 0 })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
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
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @ApiProperty({
    example: ['Cerca de colegios', 'A 5 min de la rambla', 'Zona residencial'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  location?: string[];
}

export class CreatePropertyDto {
  @ApiProperty({ example: 'Casa Moderna en Carrasco' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Hermosa casa con todas las comodidades',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: PropertyType, example: PropertyType.HOUSE })
  @IsEnum(PropertyType)
  @IsNotEmpty()
  propertyType: PropertyType;

  @ApiProperty({ enum: OperationType, example: OperationType.SALE })
  @IsEnum(OperationType)
  @IsNotEmpty()
  operation: OperationType;

  @ApiProperty({
    type: [PropertyImageDto],
    example: [
      { url: 'https://example.com/image1.jpg', order: 0, isCover: true },
      { url: 'https://example.com/image2.jpg', order: 1, isCover: false },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyImageDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  images: PropertyImageDto[];

  @ApiProperty({ example: 'Av. Bolivia 1234, Carrasco' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 450000 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  bedrooms: number;

  @ApiProperty({ example: 2, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  bathrooms?: number;

  @ApiProperty({ example: 150, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  builtArea?: number;

  @ApiProperty({ example: 300, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  landArea?: number;

  @ApiProperty({ example: 2, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  garageSpaces?: number;

  @ApiProperty({ example: 2020, required: false })
  @IsNumber()
  @IsOptional()
  @Min(1800)
  yearBuilt?: number;

  @ApiProperty({ type: PropertyFeaturesDto, required: false })
  @IsObject()
  @ValidateNested()
  @Type(() => PropertyFeaturesDto)
  @IsOptional()
  features?: PropertyFeaturesDto;
}
