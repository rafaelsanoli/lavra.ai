import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MARKET_QUEUE } from './market-queue.module';

export interface UpdatePricesJobData {
  commodity: string;
  market: string;
  userId?: string;
}

@Injectable()
export class MarketQueueService {
  private readonly logger = new Logger(MarketQueueService.name);

  constructor(
    @InjectQueue(MARKET_QUEUE)
    private marketQueue: Queue<UpdatePricesJobData>,
  ) {}

  async addUpdatePricesJob(data: UpdatePricesJobData): Promise<void> {
    this.logger.log(
      `Adding price update job for ${data.commodity} at ${data.market}`,
    );

    await this.marketQueue.add('update-prices', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 3000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  async addBulkPriceUpdate(
    commodities: string[],
    market: string,
  ): Promise<void> {
    this.logger.log(
      `Adding bulk price update for ${commodities.length} commodities at ${market}`,
    );

    const jobs = commodities.map((commodity) => ({
      name: 'update-prices',
      data: { commodity, market },
      opts: {
        attempts: 3,
        backoff: {
          type: 'exponential' as const,
          delay: 3000,
        },
      },
    }));

    await this.marketQueue.addBulk(jobs);
  }

  async schedulePeriodicUpdate(
    commodity: string,
    market: string,
    cronExpression: string = '0 9-17 * * 1-5', // Business hours, weekdays
  ): Promise<void> {
    this.logger.log(
      `Scheduling periodic price update for ${commodity} at ${market} with cron: ${cronExpression}`,
    );

    await this.marketQueue.add(
      'update-prices',
      { commodity, market },
      {
        repeat: {
          cron: cronExpression,
        },
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
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
    const counts = await this.marketQueue.getJobCounts();
    return counts;
  }

  async clearQueue(): Promise<void> {
    await this.marketQueue.empty();
    this.logger.log('Market queue cleared');
  }
}
