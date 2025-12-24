import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
