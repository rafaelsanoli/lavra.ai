import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SIMULATION_QUEUE } from './simulation-queue.module';

export interface RunSimulationJobData {
  simulationId: string;
  userId: string;
  priority?: number;
}

@Injectable()
export class SimulationQueueService {
  private readonly logger = new Logger(SimulationQueueService.name);

  constructor(
    @InjectQueue(SIMULATION_QUEUE)
    private simulationQueue: Queue<RunSimulationJobData>,
  ) {}

  async addRunSimulationJob(
    data: RunSimulationJobData,
    priority: number = 5,
  ): Promise<void> {
    this.logger.log(
      `Adding simulation job for simulation ${data.simulationId} with priority ${priority}`,
    );

    await this.simulationQueue.add('run-simulation', data, {
      priority,
      attempts: 2,
      backoff: {
        type: 'fixed',
        delay: 5000,
      },
      timeout: 300000, // 5 minutes
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  async addBulkSimulations(
    simulations: RunSimulationJobData[],
  ): Promise<void> {
    this.logger.log(`Adding bulk simulation jobs: ${simulations.length}`);

    const jobs = simulations.map((sim) => ({
      name: 'run-simulation',
      data: sim,
      opts: {
        priority: sim.priority || 5,
        attempts: 2,
        timeout: 300000,
      },
    }));

    await this.simulationQueue.addBulk(jobs);
  }

  async getJobCounts(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  }> {
    const counts = await this.simulationQueue.getJobCounts();
    return counts;
  }

  async pauseQueue(): Promise<void> {
    await this.simulationQueue.pause();
    this.logger.log('Simulation queue paused');
  }

  async resumeQueue(): Promise<void> {
    await this.simulationQueue.resume();
    this.logger.log('Simulation queue resumed');
  }

  async clearQueue(): Promise<void> {
    await this.simulationQueue.empty();
    this.logger.log('Simulation queue cleared');
  }
}
