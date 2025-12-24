import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Repository } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

async function checkAdminPermissions() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));

  try {
    const adminEmail = 'admin@beluz.com';

    console.log('🔍 Checking admin permissions...\n');

    const admin = await userRepository.findOne({
      where: { email: adminEmail },
      relations: ['roles'],
    });

    if (!admin) {
      console.error(`❌ User with email ${adminEmail} not found`);
      await app.close();
      process.exit(1);
    }

    console.log('📧 Email:', admin.email);
    console.log('👤 Name:', `${admin.firstName} ${admin.lastName}`);
    console.log('✅ Active:', admin.isActive);
    console.log('\n🎭 Roles:');

    admin.roles.forEach((role) => {
      console.log(`\n  Role: ${role.name}`);
      console.log(`  Description: ${role.description}`);
      console.log(`  Permissions (${role.permissions.length}):`);
      role.permissions.forEach((permission) => {
        console.log(`    - ${permission}`);
      });
    });

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Check failed:', error);
    await app.close();
    process.exit(1);
  }
}

checkAdminPermissions();
