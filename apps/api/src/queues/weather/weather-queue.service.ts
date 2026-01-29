import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { WEATHER_QUEUE } from './weather-queue.module';

export interface UpdateWeatherJobData {
  farmId: string;
  userId: string;
  force?: boolean;
}

@Injectable()
export class WeatherQueueService {
  private readonly logger = new Logger(WeatherQueueService.name);

  constructor(
    @InjectQueue(WEATHER_QUEUE)
    private weatherQueue: Queue<UpdateWeatherJobData>,
  ) {}

  async addUpdateWeatherJob(data: UpdateWeatherJobData): Promise<void> {
    this.logger.log(
      `Adding weather update job for farm ${data.farmId}`,
    );

    await this.weatherQueue.add('update-weather', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  async addBulkWeatherUpdate(farmIds: string[], userId: string): Promise<void> {
    this.logger.log(`Adding bulk weather update for ${farmIds.length} farms`);

    const jobs = farmIds.map((farmId) => ({
      name: 'update-weather',
      data: { farmId, userId },
      opts: {
        attempts: 3,
        backoff: {
          type: 'exponential' as const,
          delay: 2000,
        },
      },
    }));

    await this.weatherQueue.addBulk(jobs);
  }

  async schedulePeriodicUpdate(
    farmId: string,
    userId: string,
    cronExpression: string = '0 */6 * * *', // Every 6 hours
  ): Promise<void> {
    this.logger.log(
      `Scheduling periodic weather update for farm ${farmId} with cron: ${cronExpression}`,
    );

    await this.weatherQueue.add(
      'update-weather',
      { farmId, userId },
      {
        repeat: {
          cron: cronExpression,
        },
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    );
  }

  async getJobCounts(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  }> {
    const counts = await this.weatherQueue.getJobCounts();
    return counts;
  }

  async clearQueue(): Promise<void> {
    await this.weatherQueue.empty();
    this.logger.log('Weather queue cleared');
  }
}
