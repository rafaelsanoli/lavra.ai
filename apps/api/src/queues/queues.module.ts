import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WeatherQueueModule } from './weather/weather-queue.module';
import { MarketQueueModule } from './market/market-queue.module';
import { SimulationQueueModule } from './simulation/simulation-queue.module';
import { NotificationQueueModule } from './notification/notification-queue.module';

@Module({
  imports: [
    // Configure Bull with Redis
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),

    // Register queue modules
    WeatherQueueModule,
    MarketQueueModule,
    SimulationQueueModule,
    NotificationQueueModule,
  ],
  exports: [
    WeatherQueueModule,
    MarketQueueModule,
    SimulationQueueModule,
    NotificationQueueModule,
  ],
})
export class QueuesModule {}
