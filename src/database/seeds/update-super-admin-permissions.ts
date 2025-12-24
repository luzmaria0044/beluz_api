import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Repository } from 'typeorm';
import { RoleEntity } from '@modules/roles/entities/role.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Permission } from '@common/enums/permission.enum';

async function updateSuperAdminPermissions() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const roleRepository = app.get<Repository<RoleEntity>>(
    getRepositoryToken(RoleEntity),
  );

  try {
    console.log('🔧 Updating super admin permissions...\n');

    const superAdminRole = await roleRepository.findOne({
      where: { name: 'super_admin' },
    });

    if (!superAdminRole) {
      console.error('❌ Super admin role not found');
      await app.close();
      process.exit(1);
    }

    console.log('Current permissions:', superAdminRole.permissions.length);
    console.log('Permissions:', superAdminRole.permissions);

    // Update with ALL permissions
    const allPermissions = Object.values(Permission);
    superAdminRole.permissions = allPermissions;

    await roleRepository.save(superAdminRole);

    console.log('\n✅ Super admin permissions updated successfully!');
    console.log('New permissions count:', allPermissions.length);
    console.log('New permissions:');
    allPermissions.forEach((perm) => console.log(`  - ${perm}`));

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Update failed:', error);
    await app.close();
    process.exit(1);
  }
}

updateSuperAdminPermissions();
