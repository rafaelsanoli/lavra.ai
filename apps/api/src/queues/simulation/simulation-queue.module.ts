import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SimulationQueueService } from './simulation-queue.service';
import { SimulationProcessor } from './simulation.processor';
import { SimulationsModule } from '../../modules/simulations/simulations.module';

export const SIMULATION_QUEUE = 'simulation';

@Module({
  imports: [
    BullModule.registerQueue({
      name: SIMULATION_QUEUE,
    }),
    forwardRef(() => SimulationsModule),
  ],
  providers: [SimulationQueueService, SimulationProcessor],
  exports: [SimulationQueueService],
})
export class SimulationQueueModule {}
