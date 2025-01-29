import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
