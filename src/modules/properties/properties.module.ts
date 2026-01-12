import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesService } from './properties.service';
import { PropertiesImportService } from './properties-import.service';
import { PropertiesController } from './properties.controller';
import { Property } from './entities/property.entity';
import { PropertyImage } from './entities/property-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Property, PropertyImage])],
  controllers: [PropertiesController],
  providers: [PropertiesService, PropertiesImportService],
  exports: [PropertiesService],
})
export class PropertiesModule {}
