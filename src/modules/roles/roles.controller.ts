import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { PermissionsGuard } from '@common/guards/permissions.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { Permissions } from '@common/decorators/permissions.decorator';
import { Role } from '@common/enums/role.enum';
import { Permission } from '@common/enums/permission.enum';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@ApiBearerAuth('JWT-auth')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN)
  @Permissions(Permission.CREATE_ROLE)
  @ApiOperation({ summary: 'Create a new role (Super Admin only)' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Permissions(Permission.READ_ROLE)
  @ApiOperation({ summary: 'Get all roles' })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Permissions(Permission.READ_ROLE)
  @ApiOperation({ summary: 'Get role by ID' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN)
  @Permissions(Permission.UPDATE_ROLE)
  @ApiOperation({ summary: 'Update role (Super Admin only)' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @Permissions(Permission.DELETE_ROLE)
  @ApiOperation({ summary: 'Delete role (Super Admin only)' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
