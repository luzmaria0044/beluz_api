import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private rolesRepository: Repository<RoleEntity>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const existingRole = await this.rolesRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException('Role name already exists');
    }

    const role = this.rolesRepository.create(createRoleDto);
    return this.rolesRepository.save(role);
  }

  async findAll(): Promise<RoleEntity[]> {
    return this.rolesRepository.find();
  }

  async findOne(id: string): Promise<RoleEntity> {
    const role = await this.rolesRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
    const role = await this.findOne(id);

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.rolesRepository.findOne({
        where: { name: updateRoleDto.name },
      });
      if (existingRole) {
        throw new ConflictException('Role name already exists');
      }
    }

    Object.assign(role, updateRoleDto);
    return this.rolesRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);
    await this.rolesRepository.remove(role);
  }
}
