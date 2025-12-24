import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const seedService = app.get(SeedService);

  try {
    await seedService.seed();
    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
