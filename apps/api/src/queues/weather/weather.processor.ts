import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { WEATHER_QUEUE } from './weather-queue.module';
import { UpdateWeatherJobData } from './weather-queue.service';
import { ClimateDataService } from '../../modules/climate-data/climate-data.service';
import { FarmsService } from '../../modules/farms/farms.service';
import { AlertsService } from '../../modules/alerts/alerts.service';
import { AlertType, AlertSeverity } from '../../modules/alerts/dto/create-alert.input';

@Processor(WEATHER_QUEUE)
export class WeatherProcessor {
  private readonly logger = new Logger(WeatherProcessor.name);

  constructor(
    private readonly climateDataService: ClimateDataService,
    private readonly farmsService: FarmsService,
    private readonly alertsService: AlertsService,
  ) {}

  @Process('update-weather')
  async handleUpdateWeather(job: Job<UpdateWeatherJobData>) {
    const { farmId, userId, force } = job.data;

    this.logger.log(
      `Processing weather update for farm ${farmId} (job ${job.id})`,
    );

    try {
      // Get farm details
      const farm = await this.farmsService.findOne(userId, farmId);

      if (!farm.latitude || !farm.longitude) {
        this.logger.warn(
          `Farm ${farmId} has no coordinates, skipping weather update`,
        );
        return { success: false, reason: 'No coordinates' };
      }

      // TODO: Fetch weather data from OpenWeather API
      // This will be implemented in the Integrations module
      const weatherData = {
        temperature: 25 + Math.random() * 10, // Simulated data
        humidity: 60 + Math.random() * 20,
        rainfall: Math.random() > 0.7 ? Math.random() * 20 : 0,
        windSpeed: 10 + Math.random() * 30,
      };

      // Save to database
      const savedData = await this.climateDataService.create(userId, {
        farmId,
        date: new Date().toISOString(),
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        rainfall: weatherData.rainfall || 0,
        windSpeed: weatherData.windSpeed,
      });

      // Check for weather alerts
      await this.checkWeatherAlerts(
        userId,
        farmId,
        weatherData,
      );

      this.logger.log(
        `Weather update completed for farm ${farmId} - Temp: ${weatherData.temperature}°C, Humidity: ${weatherData.humidity}%`,
      );

      return {
        success: true,
        farmId,
        weatherData: savedData,
      };
    } catch (error) {
      this.logger.error(
        `Failed to update weather for farm ${farmId}: ${error.message}`,
        error.stack,
      );
      throw error; // Retry will be triggered
    }
  }

  private async checkWeatherAlerts(
    userId: string,
    farmId: string,
    weatherData: any,
  ): Promise<void> {
    // High temperature alert
    if (weatherData.temperature > 35) {
      await this.alertsService.create(userId, {
        type: AlertType.WEATHER,
        severity: AlertSeverity.HIGH,
        title: 'Alta temperatura detectada',
        message: `Temperatura de ${weatherData.temperature}°C pode afetar produtividade das culturas.`,
        metadata: JSON.stringify({ temperature: weatherData.temperature, farmId }),
      });
    }

    // Low temperature alert (frost risk)
    if (weatherData.temperature < 5) {
      await this.alertsService.create(userId, {
        type: AlertType.WEATHER,
        severity: AlertSeverity.CRITICAL,
        title: 'Risco de geada',
        message: `Temperatura de ${weatherData.temperature}°C pode causar geada. Medidas de proteção recomendadas.`,
        metadata: JSON.stringify({ temperature: weatherData.temperature, farmId }),
      });
    }

    // Heavy rainfall alert
    if (weatherData.rainfall && weatherData.rainfall > 50) {
      await this.alertsService.create(userId, {
        type: AlertType.WEATHER,
        severity: AlertSeverity.MEDIUM,
        title: 'Chuva intensa detectada',
        message: `Precipitação de ${weatherData.rainfall}mm pode afetar operações de campo.`,
        metadata: JSON.stringify({ rainfall: weatherData.rainfall, farmId }),
      });
    }

    // High wind alert
    if (weatherData.windSpeed > 60) {
      await this.alertsService.create(userId, {
        type: AlertType.WEATHER,
        severity: AlertSeverity.HIGH,
        title: 'Ventos fortes',
        message: `Ventos de ${weatherData.windSpeed}km/h podem danificar culturas.`,
        metadata: JSON.stringify({ windSpeed: weatherData.windSpeed, farmId }),
      });
    }
  }
}
