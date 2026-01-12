import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { Property } from './entities/property.entity';
import { PropertyImage } from './entities/property-image.entity';
import { PropertyType } from './enums/property-type.enum';
import { OperationType } from './enums/operation-type.enum';

interface ImportResult {
  imported: number;
  skipped: number;
  errors: number;
  errorMessages: string[];
}

@Injectable()
export class PropertiesImportService {
  private readonly logger = new Logger(PropertiesImportService.name);

  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(PropertyImage)
    private readonly propertyImageRepository: Repository<PropertyImage>,
  ) {}

  async importFromExcel(
    fileBuffer: Buffer,
    agentName: string = 'Luz Gutierrez',
  ): Promise<ImportResult> {
    const result: ImportResult = {
      imported: 0,
      skipped: 0,
      errors: 0,
      errorMessages: [],
    };

    try {
      // Parse Excel file
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Read data as array
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Row 0 is title, Row 1 is headers, Row 2+ is data
      const headers = rawData[1] as string[];
      const dataRows = rawData.slice(2) as any[][];

      this.logger.log(`Processing ${dataRows.length} rows from Excel`);

      // Find column indices
      const indices = {
        codigo: headers.indexOf('Código'),
        direccion: headers.indexOf('Dirección'),
        agente: headers.indexOf('Agente'),
        tipo: headers.indexOf('Tipo'),
        ciudad: headers.indexOf('Ciudad'),
        barrio: headers.indexOf('Barrio'),
        tipoOperacion: headers.indexOf('Tipo de operación'),
        precio: headers.indexOf('Precio'),
        dormitorios: headers.indexOf('Dormitorios'),
        banos: headers.indexOf('Baños'),
      };

      // Process each row
      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];

        try {
          // Get agent name
          const rowAgent = row[indices.agente]?.toString().trim();

          // Skip if not the specified agent
          if (rowAgent !== agentName) {
            result.skipped++;
            continue;
          }

          // Map property type
          const tipoStr = row[indices.tipo]?.toString().trim();
          let propertyType: PropertyType;

          if (tipoStr?.includes('Apartamento')) {
            propertyType = PropertyType.APARTMENT;
          } else if (tipoStr?.includes('Casa')) {
            propertyType = PropertyType.HOUSE;
          } else if (tipoStr?.includes('Local')) {
            propertyType = PropertyType.COMMERCIAL;
          } else if (tipoStr?.includes('Terreno')) {
            propertyType = PropertyType.TERRAIN;
          } else {
            propertyType = PropertyType.APARTMENT; // Default
          }

          // Map operation type
          const operacionStr = row[indices.tipoOperacion]?.toString().trim();
          const operation =
            operacionStr === 'VENTA' ? OperationType.SALE : OperationType.RENT;

          // Parse price
          const precioStr = row[indices.precio]?.toString().replace(/,/g, '');
          const price = parseFloat(precioStr) || 0;

          // Parse bedrooms and bathrooms
          const bedrooms = parseInt(row[indices.dormitorios]?.toString()) || 0;
          const bathrooms = parseInt(row[indices.banos]?.toString()) || 0;

          // Get address
          const address = row[indices.direccion]?.toString().trim() || '';
          const ciudad = row[indices.ciudad]?.toString().trim() || '';
          const barrio = row[indices.barrio]?.toString().trim() || '';
          const fullAddress = `${address}, ${barrio ? barrio + ', ' : ''}${ciudad}`.trim();

          // Create title
          const codigo = row[indices.codigo]?.toString().trim() || '';
          const title = `${propertyType} en ${operation === 'Venta' ? 'venta' : 'alquiler'} - ${ciudad}`;

          // Collect image URLs (columns start at index 32 for "Imagen 1")
          const images: string[] = [];
          for (let j = 32; j < Math.min(headers.length, 82); j++) {
            // Up to 50 images
            const imageUrl = row[j]?.toString().trim();
            if (imageUrl && imageUrl.startsWith('http')) {
              images.push(imageUrl);
            }
          }

          // Create property
          const property = this.propertyRepository.create({
            title: title.substring(0, 200),
            description: `Código: ${codigo}`,
            propertyType,
            operation,
            address: fullAddress.substring(0, 255),
            price,
            bedrooms,
            bathrooms,
            isActive: true,
          });

          const savedProperty = await this.propertyRepository.save(property);

          // Create property images
          if (images.length > 0) {
            const propertyImages = images.map((url, index) =>
              this.propertyImageRepository.create({
                url,
                order: index,
                isCover: index === 0,
                property: savedProperty,
              }),
            );

            await this.propertyImageRepository.save(propertyImages);
          }

          result.imported++;
          this.logger.log(
            `Imported property ${result.imported}: ${title} (${images.length} images)`,
          );
        } catch (error) {
          result.errors++;
          const errorMsg = `Row ${i + 3}: ${error.message}`;
          result.errorMessages.push(errorMsg);
          this.logger.error(errorMsg);
        }
      }

      this.logger.log(
        `Import completed: ${result.imported} imported, ${result.skipped} skipped, ${result.errors} errors`,
      );

      return result;
    } catch (error) {
      this.logger.error('Error importing Excel file', error);
      throw error;
    }
  }
}
