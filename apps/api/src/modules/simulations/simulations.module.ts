import { Module } from '@nestjs/common';
import { SimulationsService } from './simulations.service';
import { SimulationsResolver } from './simulations.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SimulationsResolver, SimulationsService],
  exports: [SimulationsService],
})
export class SimulationsModule {}
