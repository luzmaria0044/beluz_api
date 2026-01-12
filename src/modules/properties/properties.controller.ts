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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { PropertiesImportService } from './properties-import.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { ImportPropertiesResponseDto } from './dto/import-properties.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { PermissionsGuard } from '@common/guards/permissions.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { Permissions } from '@common/decorators/permissions.decorator';
import { Role } from '@common/enums/role.enum';
import { Permission } from '@common/enums/permission.enum';
import { PropertyType } from './enums/property-type.enum';
import { OperationType } from './enums/operation-type.enum';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly propertiesImportService: PropertiesImportService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Permissions(Permission.CREATE_PROPERTY)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new property (Admin only)' })
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all properties' })
  findAll() {
    return this.propertiesService.findAll();
  }

  @Get('by-type/:type')
  @ApiOperation({ summary: 'Get properties by type' })
  @ApiQuery({ name: 'type', enum: PropertyType })
  findByType(@Param('type') type: PropertyType) {
    return this.propertiesService.findByType(type);
  }

  @Get('by-operation/:operation')
  @ApiOperation({ summary: 'Get properties by operation (Sale/Rent)' })
  @ApiQuery({ name: 'operation', enum: OperationType })
  findByOperation(@Param('operation') operation: string) {
    return this.propertiesService.findByOperation(operation);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property by ID' })
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Permissions(Permission.UPDATE_PROPERTY)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update property' })
  update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Permissions(Permission.DELETE_PROPERTY)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete property (Admin only)' })
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }

  @Post('import')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Permissions(Permission.CREATE_PROPERTY)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Import properties from Excel file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async importProperties(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ImportPropertiesResponseDto> {
    if (!file) {
      throw new Error('No file uploaded');
    }

    return this.propertiesImportService.importFromExcel(file.buffer);
  }
}
