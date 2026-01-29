import { Module } from '@nestjs/common';
import { PlantingsService } from './plantings.service';
import { PlantingsResolver } from './plantings.resolver';
import { PrismaModule } from '../../prisma/prisma.module';
import { LoggerService } from '../../common/logger/logger.service';

@Module({
  imports: [PrismaModule],
  providers: [PlantingsResolver, PlantingsService, LoggerService],
  exports: [PlantingsService]
})
export class PlantingsModule {}
