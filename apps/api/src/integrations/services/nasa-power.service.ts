import { Injectable, Logger, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import {
  NasaPowerDataDto,
  NasaPowerDailyDataDto,
  NasaPowerAgriculturalIndicesDto,
} from '../dto/nasa-power.dto';

/**
 * Serviço de integração com NASA POWER API
 * (Prediction Of Worldwide Energy Resources)
 * 
 * Fornece dados climáticos globais via satélite:
 * - Temperatura, precipitação, radiação solar
 * - Dados históricos de 1981 até presente
 * - Resolução: 0.5° x 0.5° (~50km)
 * - Ideal para áreas sem estações meteorológicas
 * 
 * API: https://power.larc.nasa.gov/docs/services/api/
 */
@Injectable()
export class NasaPowerService {
  private readonly logger = new Logger(NasaPowerService.name);
  private readonly baseUrl = 'https://power.larc.nasa.gov/api/temporal';

  // Parâmetros principais para agricultura
  private readonly agriculturalParams = [
    'T2M',           // Temperature at 2 Meters
    'T2M_MAX',       // Max Temperature
    'T2M_MIN',       // Min Temperature
    'PRECTOTCORR',   // Precipitation Corrected
    'RH2M',          // Relative Humidity
    'WS2M',          // Wind Speed at 2 Meters
    'ALLSKY_SFC_SW_DWN', // Solar Radiation
    'ALLSKY_SFC_PAR_TOT', // Photosynthetically Active Radiation
  ];

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Obter dados climáticos diários
   * Cache: 12 horas para histórico, 1 hora para dados recentes
   */
  async getDailyData(
    latitude: number,
    longitude: number,
    startDate: Date,
    endDate: Date,
  ): Promise<NasaPowerDataDto> {
    const cacheKey = `nasa:daily:${latitude}:${longitude}:${startDate.toISOString()}:${endDate.toISOString()}`;
    const cached = await this.cacheManager.get<NasaPowerDataDto>(cacheKey);
    if (cached) return cached;

    try {
      this.logger.log(`Fetching NASA POWER data for ${latitude},${longitude}`);

      const startStr = this.formatDate(startDate);
      const endStr = this.formatDate(endDate);
      const params = this.agriculturalParams.join(',');

      // TODO: Implementar chamada real
      // const response = await firstValueFrom(
      //   this.httpService.get(`${this.baseUrl}/daily/point`, {
      //     params: {
      //       parameters: params,
      //       community: 'AG', // Agricultural community
      //       longitude,
      //       latitude,
      //       start: startStr,
      //       end: endStr,
      //       format: 'JSON',
      //     },
      //   }),
      // );

      // Mock data
      const dailyData: NasaPowerDailyDataDto[] = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        dailyData.push({
          date: new Date(currentDate),
          parameters: {
            T2M: 20 + Math.random() * 10,
            T2M_MAX: 25 + Math.random() * 10,
            T2M_MIN: 15 + Math.random() * 8,
            PRECTOTCORR: Math.random() < 0.3 ? Math.random() * 15 : 0,
            RH2M: 50 + Math.random() * 40,
            WS2M: Math.random() * 8,
            ALLSKY_SFC_SW_DWN: 4 + Math.random() * 3,
            ALLSKY_SFC_PAR_TOT: 30 + Math.random() * 20,
          },
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      const result: NasaPowerDataDto = {
        latitude,
        longitude,
        startDate,
        endDate,
        data: dailyData,
        metadata: {
          source: 'NASA POWER',
          version: 'v2.0',
          resolution: '0.5° x 0.5°',
        },
      };

      // Cache mais longo para dados antigos
      const isHistorical = endDate < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const ttl = isHistorical ? 43200000 : 3600000; // 12h ou 1h

      await this.cacheManager.set(cacheKey, result, ttl);
      return result;
    } catch (error) {
      this.logger.error('Failed to fetch NASA POWER data:', error.message);
      throw new Error(`Failed to fetch NASA POWER data: ${error.message}`);
    }
  }

  /**
   * Calcular índices agrícolas derivados
   * - Evapotranspiração (ET)
   * - Déficit hídrico
   * - Graus-dia de crescimento (GDD)
   * - Risco de geada
   * - Estresse térmico
   */
  async calculateAgriculturalIndices(
    latitude: number,
    longitude: number,
    startDate: Date,
    endDate: Date,
    cropType: string = 'SOJA',
  ): Promise<NasaPowerAgriculturalIndicesDto[]> {
    const cacheKey = `nasa:indices:${latitude}:${longitude}:${cropType}:${startDate.toISOString()}`;
    const cached = await this.cacheManager.get<NasaPowerAgriculturalIndicesDto[]>(cacheKey);
    if (cached) return cached;

    try {
      // Obter dados base
      const rawData = await this.getDailyData(latitude, longitude, startDate, endDate);

      // Calcular índices para cada dia
      const indices: NasaPowerAgriculturalIndicesDto[] = rawData.data.map((day) => {
        const params = day.parameters;
        
        // Evapotranspiração simplificada (Hargreaves)
        const avgTemp = params.T2M || 20;
        const tempRange = (params.T2M_MAX || 25) - (params.T2M_MIN || 15);
        const et = 0.0023 * (avgTemp + 17.8) * Math.sqrt(tempRange) * (params.ALLSKY_SFC_SW_DWN || 5);

        // Déficit hídrico (precipitação - ET)
        const precip = params.PRECTOTCORR || 0;
        const waterDeficit = Math.max(0, et - precip);

        // Graus-dia de crescimento (base 10°C para soja)
        const baseTemp = this.getCropBaseTemp(cropType);
        const gdd = Math.max(0, avgTemp - baseTemp);

        // Risco de geada (< 2°C)
        const frostRisk = (params.T2M_MIN || 15) < 2 ? 1 : 0;

        // Estresse térmico (> 35°C)
        const heatStress = (params.T2M_MAX || 25) > 35 ? 
          Math.min(1, ((params.T2M_MAX || 25) - 35) / 10) : 0;

        return {
          date: day.date,
          evapotranspiration: et,
          waterDeficit,
          growingDegreeDays: gdd,
          frostRiskIndex: frostRisk,
          heatStressIndex: heatStress,
        };
      });

      await this.cacheManager.set(cacheKey, indices, 21600000); // 6h
      return indices;
    } catch (error) {
      this.logger.error('Failed to calculate agricultural indices:', error.message);
      throw new Error(`Failed to calculate indices: ${error.message}`);
    }
  }

  /**
   * Obter dados climáticos mensais (agregados)
   * Útil para análises de longo prazo
   */
  async getMonthlyAverages(
    latitude: number,
    longitude: number,
    year: number,
  ): Promise<NasaPowerDataDto> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const dailyData = await this.getDailyData(latitude, longitude, startDate, endDate);

    // Agregar por mês
    const monthlyData: NasaPowerDailyDataDto[] = [];
    
    for (let month = 0; month < 12; month++) {
      const monthDays = dailyData.data.filter(
        (d) => d.date.getMonth() === month,
      );

      if (monthDays.length === 0) continue;

      // Calcular médias
      const avgParams = {
        T2M: this.average(monthDays.map((d) => d.parameters.T2M || 0)),
        T2M_MAX: this.average(monthDays.map((d) => d.parameters.T2M_MAX || 0)),
        T2M_MIN: this.average(monthDays.map((d) => d.parameters.T2M_MIN || 0)),
        PRECTOTCORR: monthDays.reduce((sum, d) => sum + (d.parameters.PRECTOTCORR || 0), 0),
        RH2M: this.average(monthDays.map((d) => d.parameters.RH2M || 0)),
        WS2M: this.average(monthDays.map((d) => d.parameters.WS2M || 0)),
        ALLSKY_SFC_SW_DWN: this.average(monthDays.map((d) => d.parameters.ALLSKY_SFC_SW_DWN || 0)),
        ALLSKY_SFC_PAR_TOT: this.average(monthDays.map((d) => d.parameters.ALLSKY_SFC_PAR_TOT || 0)),
      };

      monthlyData.push({
        date: new Date(year, month, 15), // Mid-month
        parameters: avgParams,
      });
    }

    return {
      latitude,
      longitude,
      startDate,
      endDate,
      data: monthlyData,
      metadata: {
        aggregation: 'monthly',
        source: 'NASA POWER',
      },
    };
  }

  // Helpers
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  private getCropBaseTemp(cropType: string): number {
    const baseTemps: Record<string, number> = {
      SOJA: 10,
      MILHO: 10,
      CAFE: 12,
      TRIGO: 5,
      ALGODAO: 15,
    };
    return baseTemps[cropType.toUpperCase()] || 10;
  }

  private average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }
}
