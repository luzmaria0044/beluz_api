import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SeedService } from './seed.service';
import { RoleEntity } from '@modules/roles/entities/role.entity';
import { User } from '@modules/users/entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([RoleEntity, User]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
