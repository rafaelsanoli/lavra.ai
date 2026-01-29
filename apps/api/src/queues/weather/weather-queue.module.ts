import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { WeatherQueueService } from './weather-queue.service';
import { WeatherProcessor } from './weather.processor';
import { ClimateDataModule } from '../../modules/climate-data/climate-data.module';
import { FarmsModule } from '../../modules/farms/farms.module';
import { AlertsModule } from '../../modules/alerts/alerts.module';

export const WEATHER_QUEUE = 'weather';

@Module({
  imports: [
    BullModule.registerQueue({
      name: WEATHER_QUEUE,
    }),
    forwardRef(() => ClimateDataModule),
    forwardRef(() => FarmsModule),
    forwardRef(() => AlertsModule),
  ],
  providers: [WeatherQueueService, WeatherProcessor],
  exports: [WeatherQueueService],
})
export class WeatherQueueModule {}
