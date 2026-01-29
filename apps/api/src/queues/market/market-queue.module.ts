import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MarketQueueService } from './market-queue.service';
import { MarketProcessor } from './market.processor';
import { MarketPricesModule } from '../../modules/market-prices/market-prices.module';
import { AlertsModule } from '../../modules/alerts/alerts.module';

export const MARKET_QUEUE = 'market';

@Module({
  imports: [
    BullModule.registerQueue({
      name: MARKET_QUEUE,
    }),
    forwardRef(() => MarketPricesModule),
    forwardRef(() => AlertsModule),
  ],
  providers: [MarketQueueService, MarketProcessor],
  exports: [MarketQueueService],
})
export class MarketQueueModule {}
