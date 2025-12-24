import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { PropertyImage } from './entities/property-image.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyType } from './enums/property-type.enum';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
    @InjectRepository(PropertyImage)
    private propertyImagesRepository: Repository<PropertyImage>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    this.validatePropertyRequirements(createPropertyDto);
    this.validateCoverImage(createPropertyDto.images);

    const property = this.propertiesRepository.create({
      ...createPropertyDto,
      images: createPropertyDto.images.map((img) =>
        this.propertyImagesRepository.create(img),
      ),
    });

    return this.propertiesRepository.save(property);
  }

  async findAll(): Promise<Property[]> {
    return this.propertiesRepository.find({
      relations: ['images'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertiesRepository.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
    const property = await this.findOne(id);

    if (updatePropertyDto.propertyType || updatePropertyDto.bathrooms !== undefined || updatePropertyDto.builtArea !== undefined) {
      const mergedData = { ...property, ...updatePropertyDto };
      this.validatePropertyRequirements(mergedData);
    }

    if (updatePropertyDto.images) {
      this.validateCoverImage(updatePropertyDto.images);
      await this.propertyImagesRepository.delete({ property: { id } });
      property.images = updatePropertyDto.images.map((img) =>
        this.propertyImagesRepository.create(img),
      );
    }

    Object.assign(property, updatePropertyDto);
    return this.propertiesRepository.save(property);
  }

  async remove(id: string): Promise<void> {
    const property = await this.findOne(id);
    await this.propertiesRepository.remove(property);
  }

  async findByType(propertyType: PropertyType): Promise<Property[]> {
    return this.propertiesRepository.find({
      where: { propertyType },
      relations: ['images'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByOperation(operation: string): Promise<Property[]> {
    return this.propertiesRepository.find({
      where: { operation: operation as any },
      relations: ['images'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  private validatePropertyRequirements(data: any): void {
    const requiresBathroomsAndArea = [
      PropertyType.COMMERCIAL,
      PropertyType.APARTMENT,
      PropertyType.HOUSE,
    ];

    if (requiresBathroomsAndArea.includes(data.propertyType)) {
      if (data.bathrooms === undefined || data.bathrooms === null) {
        throw new BadRequestException(
          `Bathrooms is required for ${data.propertyType}`,
        );
      }
      if (data.builtArea === undefined || data.builtArea === null) {
        throw new BadRequestException(
          `Built area is required for ${data.propertyType}`,
        );
      }
    }
  }

  private validateCoverImage(images: any[]): void {
    const coverImages = images.filter((img) => img.isCover === true);

    if (coverImages.length > 1) {
      throw new BadRequestException(
        'Only one image can be marked as cover',
      );
    }
  }
}
