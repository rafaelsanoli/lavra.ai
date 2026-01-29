import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MARKET_QUEUE } from './market-queue.module';
import { UpdatePricesJobData } from './market-queue.service';
import { MarketPricesService } from '../../modules/market-prices/market-prices.service';
import { AlertsService } from '../../modules/alerts/alerts.service';
import { AlertType, AlertSeverity } from '../../modules/alerts/dto/create-alert.input';

@Processor(MARKET_QUEUE)
export class MarketProcessor {
  private readonly logger = new Logger(MarketProcessor.name);

  constructor(
    private readonly marketPricesService: MarketPricesService,
    private readonly alertsService: AlertsService,
  ) {}

  @Process('update-prices')
  async handleUpdatePrices(job: Job<UpdatePricesJobData>) {
    const { commodity, market, userId } = job.data;

    this.logger.log(
      `Processing price update for ${commodity} at ${market} (job ${job.id})`,
    );

    try {
      // Simulate fetching price from external API
      // In production, this would call B3, CBOT, etc.
      const currentPrice = await this.fetchPriceFromMarket(commodity, market);

      // Save to database
      const savedPrice = await this.marketPricesService.create({
        commodity,
        market,
        price: currentPrice,
        currency: 'BRL',
        unit: 'kg',
        timestamp: new Date().toISOString(),
        source: `${market}-api`,
      });

      // Check for price alerts
      if (userId) {
        await this.checkPriceAlerts(
          userId,
          commodity,
          market,
          currentPrice,
        );
      }

      this.logger.log(
        `Price update completed for ${commodity} at ${market} - Price: ${currentPrice}`,
      );

      return {
        success: true,
        commodity,
        market,
        price: savedPrice,
      };
    } catch (error) {
      this.logger.error(
        `Failed to update price for ${commodity} at ${market}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async fetchPriceFromMarket(
    commodity: string,
    market: string,
  ): Promise<number> {
    // Simulate API call with realistic prices
    const basePrices: Record<string, number> = {
      soja: 150,
      milho: 80,
      cafe: 1200,
      trigo: 90,
      algodao: 450,
    };

    const basePrice = basePrices[commodity.toLowerCase()] || 100;
    
    // Add some randomness (+/- 5%)
    const variation = (Math.random() - 0.5) * 0.1;
    return Math.round(basePrice * (1 + variation) * 100) / 100;
  }

  private async checkPriceAlerts(
    userId: string,
    commodity: string,
    market: string,
    currentPrice: number,
  ): Promise<void> {
    try {
      // Get price trend
      const trend = await this.marketPricesService.getPriceTrend(
        commodity,
        market,
        30, // Last 30 days
      );

      // Alert on significant price changes
      if (trend.trend === 'UP' && trend.changePercent > 10) {
        await this.alertsService.create(userId, {
          type: AlertType.MARKET,
          severity: AlertSeverity.MEDIUM,
          title: `Alta de ${commodity.toUpperCase()} detectada`,
          message: `Preço de ${commodity} subiu ${trend.changePercent.toFixed(1)}% nos últimos 30 dias. Preço atual: R$ ${currentPrice}`,
          metadata: JSON.stringify({
            commodity,
            market,
            currentPrice,
            trend: trend.trend,
            changePercent: trend.changePercent,
          }),
        });
      }

      if (trend.trend === 'DOWN' && trend.changePercent < -10) {
        await this.alertsService.create(userId, {
          type: AlertType.MARKET,
          severity: AlertSeverity.HIGH,
          title: `Queda de ${commodity.toUpperCase()} detectada`,
          message: `Preço de ${commodity} caiu ${Math.abs(trend.changePercent).toFixed(1)}% nos últimos 30 dias. Preço atual: R$ ${currentPrice}`,
          metadata: JSON.stringify({
            commodity,
            market,
            currentPrice,
            trend: trend.trend,
            changePercent: trend.changePercent,
          }),
        });
      }
    } catch (error) {
      this.logger.warn(
        `Failed to check price alerts: ${error.message}`,
      );
    }
  }
}
