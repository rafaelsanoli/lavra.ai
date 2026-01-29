import { Module } from '@nestjs/common';
import { ClimateDataService } from './climate-data.service';
import { ClimateDataResolver } from './climate-data.resolver';
import { PrismaModule } from '../../prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, HttpModule],
  providers: [ClimateDataResolver, ClimateDataService],
  exports: [ClimateDataService],
})
export class ClimateDataModule {}
