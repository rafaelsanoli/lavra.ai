import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { SIMULATION_QUEUE } from './simulation-queue.module';
import { RunSimulationJobData } from './simulation-queue.service';
import { SimulationsService } from '../../modules/simulations/simulations.service';

@Processor(SIMULATION_QUEUE)
export class SimulationProcessor {
  private readonly logger = new Logger(SimulationProcessor.name);

  constructor(
    private readonly simulationsService: SimulationsService,
  ) {}

  @Process('run-simulation')
  async handleRunSimulation(job: Job<RunSimulationJobData>) {
    const { simulationId, userId } = job.data;

    this.logger.log(
      `Processing simulation ${simulationId} (job ${job.id})`,
    );

    try {
      // Update progress
      await job.progress(10);

      // Run the simulation
      const result = await this.simulationsService.runSimulation(
        userId,
        simulationId,
      );

      await job.progress(100);

      this.logger.log(
        `Simulation ${simulationId} completed successfully - ${result.scenarios.length} scenarios executed`,
      );

      return {
        success: true,
        simulationId,
        scenarioCount: result.scenarios.length,
        bestScenario: result.bestScenario,
        executedAt: result.executedAt,
      };
    } catch (error) {
      this.logger.error(
        `Failed to run simulation ${simulationId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
