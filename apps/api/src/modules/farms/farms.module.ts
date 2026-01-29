import { Module } from '@nestjs/common';
import { FarmsService } from './farms.service';
import { FarmsResolver } from './farms.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FarmsService, FarmsResolver],
  exports: [FarmsService],
})
export class FarmsModule {}
