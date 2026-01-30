import { Injectable, Logger, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import {
  InmetStationDto,
  InmetWeatherDataDto,
  InmetForecastDto,
} from '../dto/inmet-weather.dto';

/**
 * Serviço de integração com INMET (Instituto Nacional de Meteorologia)
 * 
 * Funcionalidades:
 * - Busca de estações meteorológicas
 * - Dados históricos de clima
 * - Previsões meteorológicas
 * - Alertas climáticos
 * 
 * API oficial: https://portal.inmet.gov.br/manual/manual-de-uso-da-api-estações
 */
@Injectable()
export class InmetService {
  private readonly logger = new Logger(InmetService.name);
  private readonly baseUrl = 'https://apitempo.inmet.gov.br';

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Buscar estações próximas a uma coordenada
   * Cache: 24 horas (estações raramente mudam)
   */
  async findNearbyStations(
    latitude: number,
    longitude: number,
    radiusKm = 100,
  ): Promise<InmetStationDto[]> {
    const cacheKey = `inmet:stations:${latitude}:${longitude}:${radiusKm}`;
    const cached = await this.cacheManager.get<InmetStationDto[]>(cacheKey);
    if (cached) return cached;

    try {
      this.logger.log(`Finding INMET stations near ${latitude},${longitude}`);

      // TODO: Implementar chamada real à API INMET
      // const response = await firstValueFrom(
      //   this.httpService.get(`${this.baseUrl}/estacoes/proximas`, {
      //     params: { lat: latitude, lon: longitude, raio: radiusKm },
      //   }),
      // );

      // Mock data para desenvolvimento
      const stations: InmetStationDto[] = [
        {
          code: 'A001',
          name: 'BRASILIA',
          latitude: -15.789,
          longitude: -47.926,
          uf: 'DF',
          municipality: 'BRASILIA',
        },
        {
          code: 'A002',
          name: 'GOIANIA',
          latitude: -16.672,
          longitude: -49.255,
          uf: 'GO',
          municipality: 'GOIANIA',
        },
        {
          code: 'A003',
          name: 'CUIABA',
          latitude: -15.555,
          longitude: -56.070,
          uf: 'MT',
          municipality: 'CUIABA',
        },
      ];

      // Filtrar por distância (cálculo simplificado)
      const filtered = stations.filter((station) => {
        const distance = this.calculateDistance(
          latitude,
          longitude,
          station.latitude,
          station.longitude,
        );
        return distance <= radiusKm;
      });

      await this.cacheManager.set(cacheKey, filtered, 86400000); // 24h
      return filtered;
    } catch (error) {
      this.logger.error('Failed to find INMET stations:', error.message);
      throw new Error(`Failed to find INMET stations: ${error.message}`);
    }
  }

  /**
   * Obter dados meteorológicos atuais de uma estação
   * Cache: 30 minutos
   */
  async getCurrentWeather(stationCode: string): Promise<InmetWeatherDataDto> {
    const cacheKey = `inmet:current:${stationCode}`;
    const cached = await this.cacheManager.get<InmetWeatherDataDto>(cacheKey);
    if (cached) return cached;

    try {
      this.logger.log(`Fetching current weather for station ${stationCode}`);

      // Mock data
      const data: InmetWeatherDataDto = {
        stationCode,
        timestamp: new Date(),
        temperature: 20 + Math.random() * 15,
        humidity: 40 + Math.random() * 50,
        pressure: 1000 + Math.random() * 30,
        windSpeed: Math.random() * 10,
        windDirection: Math.random() * 360,
        precipitation: Math.random() < 0.3 ? Math.random() * 20 : 0,
        solarRadiation: 200 + Math.random() * 800,
        condition: this.getRandomCondition(),
      };

      await this.cacheManager.set(cacheKey, data, 1800000); // 30 min
      return data;
    } catch (error) {
      this.logger.error(`Failed to fetch weather for ${stationCode}:`, error.message);
      throw new Error(`Failed to fetch weather: ${error.message}`);
    }
  }

  /**
   * Obter histórico de dados meteorológicos
   * Cache: 6 horas
   */
  async getHistoricalWeather(
    stationCode: string,
    startDate: Date,
    endDate: Date,
  ): Promise<InmetWeatherDataDto[]> {
    const cacheKey = `inmet:historical:${stationCode}:${startDate.toISOString()}:${endDate.toISOString()}`;
    const cached = await this.cacheManager.get<InmetWeatherDataDto[]>(cacheKey);
    if (cached) return cached;

    try {
      this.logger.log(`Fetching historical weather for ${stationCode}`);

      // Mock data - gerar dados diários
      const data: InmetWeatherDataDto[] = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        data.push({
          stationCode,
          timestamp: new Date(currentDate),
          temperature: 18 + Math.random() * 12,
          humidity: 50 + Math.random() * 40,
          pressure: 1005 + Math.random() * 20,
          windSpeed: Math.random() * 8,
          windDirection: Math.random() * 360,
          precipitation: Math.random() < 0.25 ? Math.random() * 15 : 0,
          solarRadiation: 300 + Math.random() * 600,
          condition: this.getRandomCondition(),
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      await this.cacheManager.set(cacheKey, data, 21600000); // 6h
      return data;
    } catch (error) {
      this.logger.error('Failed to fetch historical weather:', error.message);
      throw new Error(`Failed to fetch historical weather: ${error.message}`);
    }
  }

  /**
   * Obter previsão meteorológica para um município
   * Cache: 3 horas
   */
  async getForecast(municipality: string, uf: string, days = 7): Promise<InmetForecastDto[]> {
    const cacheKey = `inmet:forecast:${municipality}:${uf}:${days}`;
    const cached = await this.cacheManager.get<InmetForecastDto[]>(cacheKey);
    if (cached) return cached;

    try {
      this.logger.log(`Fetching forecast for ${municipality}/${uf}`);

      // Mock data - próximos N dias
      const forecasts: InmetForecastDto[] = [];
      const currentDate = new Date();

      for (let i = 0; i < days; i++) {
        const forecastDate = new Date(currentDate);
        forecastDate.setDate(forecastDate.getDate() + i);

        forecasts.push({
          municipality,
          uf,
          date: forecastDate,
          minTemperature: 15 + Math.random() * 8,
          maxTemperature: 25 + Math.random() * 10,
          precipitationProbability: Math.random() * 100,
          precipitationAmount: Math.random() < 0.4 ? Math.random() * 25 : 0,
          condition: this.getRandomCondition(),
          humidity: 50 + Math.random() * 40,
        });
      }

      await this.cacheManager.set(cacheKey, forecasts, 10800000); // 3h
      return forecasts;
    } catch (error) {
      this.logger.error('Failed to fetch forecast:', error.message);
      throw new Error(`Failed to fetch forecast: ${error.message}`);
    }
  }

  /**
   * Obter dados climáticos para coordenada específica
   * Útil quando não há estação próxima
   */
  async getWeatherByCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<InmetWeatherDataDto> {
    const stations = await this.findNearbyStations(latitude, longitude, 200);
    
    if (stations.length === 0) {
      throw new Error('No weather station found within 200km');
    }

    // Usar estação mais próxima
    const nearestStation = stations[0];
    return this.getCurrentWeather(nearestStation.code);
  }

  // Helpers
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  private getRandomCondition(): string {
    const conditions = [
      'ensolarado',
      'parcialmente nublado',
      'nublado',
      'chuva leve',
      'chuva moderada',
      'tempestade',
    ];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }
}
