import { Module } from '@nestjs/common';
import { HarvestsService } from './harvests.service';
import { HarvestsResolver } from './harvests.resolver';
import { PrismaModule } from '../../prisma/prisma.module';
import { LoggerService } from '../../common/logger/logger.service';

@Module({
  imports: [PrismaModule],
  providers: [HarvestsResolver, HarvestsService, LoggerService],
  exports: [HarvestsService]
})
export class HarvestsModule {}
