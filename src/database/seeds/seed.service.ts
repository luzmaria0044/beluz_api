import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RoleEntity } from '@modules/roles/entities/role.entity';
import { User } from '@modules/users/entities/user.entity';
import { Role } from '@common/enums/role.enum';
import { Permission } from '@common/enums/permission.enum';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private rolesRepository: Repository<RoleEntity>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async seed() {
    console.log('🌱 Starting database seed...');

    // 1. Crear roles
    await this.seedRoles();

    // 2. Crear usuario super admin
    await this.seedSuperAdmin();

    console.log('✅ Database seed completed successfully!');
  }

  private async seedRoles() {
    console.log('📝 Seeding roles...');

    const rolesData = [
      {
        name: Role.SUPER_ADMIN,
        description: 'Super Administrator with full system access',
        permissions: Object.values(Permission),
      },
      {
        name: Role.ADMIN,
        description: 'Administrator with limited permissions',
        permissions: [
          Permission.CREATE_USER,
          Permission.READ_USER,
          Permission.UPDATE_USER,
          Permission.DELETE_USER,
          Permission.READ_ROLE,
          Permission.VIEW_ANALYTICS,
        ],
      },
      {
        name: Role.MANAGER,
        description: 'Manager with specific permissions',
        permissions: [
          Permission.READ_USER,
          Permission.UPDATE_USER,
          Permission.READ_ROLE,
          Permission.VIEW_ANALYTICS,
        ],
      },
      {
        name: Role.USER,
        description: 'Standard user with basic permissions',
        permissions: [Permission.READ_USER],
      },
      {
        name: Role.GUEST,
        description: 'Guest user with minimal permissions',
        permissions: [],
      },
    ];

    for (const roleData of rolesData) {
      const existingRole = await this.rolesRepository.findOne({
        where: { name: roleData.name },
      });

      if (!existingRole) {
        const role = this.rolesRepository.create(roleData);
        await this.rolesRepository.save(role);
        console.log(`   ✓ Created role: ${roleData.name}`);
      } else {
        console.log(`   ⊙ Role already exists: ${roleData.name}`);
      }
    }
  }

  private async seedSuperAdmin() {
    console.log('👤 Seeding super admin user...');

    const superAdminEmail = 'admin@beluz.com';
    const existingAdmin = await this.usersRepository.findOne({
      where: { email: superAdminEmail },
    });

    if (existingAdmin) {
      console.log(`   ⊙ Super admin already exists: ${superAdminEmail}`);
      return;
    }

    const superAdminRole = await this.rolesRepository.findOne({
      where: { name: Role.SUPER_ADMIN },
    });

    if (!superAdminRole) {
      console.log('   ✗ Super admin role not found. Cannot create super admin user.');
      return;
    }

    const hashedPassword = await bcrypt.hash(
      'Admin123!',
      parseInt(this.configService.get('BCRYPT_ROUNDS', '10')),
    );

    const superAdmin = this.usersRepository.create({
      email: superAdminEmail,
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      isActive: true,
      roles: [superAdminRole],
    });

    await this.usersRepository.save(superAdmin);
    console.log(`   ✓ Created super admin: ${superAdminEmail}`);
    console.log(`   ✓ Password: Admin123!`);
    console.log('   ⚠️  Remember to change this password in production!');
  }
}
