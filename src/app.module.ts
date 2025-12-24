import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { BlogModule } from './modules/blog/blog.module';
import { SeedModule } from './database/seeds/seed.module';
import { User } from './modules/users/entities/user.entity';
import { RoleEntity } from './modules/roles/entities/role.entity';
import { Property } from './modules/properties/entities/property.entity';
import { PropertyImage } from './modules/properties/entities/property-image.entity';
import { BlogPost } from './modules/blog/entities/blog-post.entity';

@Module({
  imports: [
    // Config module - Global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database module
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, RoleEntity, Property, PropertyImage, BlogPost],
        synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
        logging: configService.get<string>('DB_LOGGING') === 'true',
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    RolesModule,
    PropertiesModule,
    BlogModule,
    SeedModule,
  ],
})
export class AppModule {}
