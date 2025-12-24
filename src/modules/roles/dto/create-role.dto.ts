import { IsNotEmpty, IsString, IsArray, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '@common/enums/permission.enum';

export class CreateRoleDto {
  @ApiProperty({ example: 'manager' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Manager role with limited permissions', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: [Permission.READ_USER, Permission.UPDATE_USER],
    enum: Permission,
    isArray: true,
    required: false
  })
  @IsArray()
  @IsEnum(Permission, { each: true })
  @IsOptional()
  permissions?: Permission[];
}
