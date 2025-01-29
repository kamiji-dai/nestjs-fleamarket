import { Module } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ItemsModule, PrismaModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
