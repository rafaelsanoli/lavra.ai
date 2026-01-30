import { Injectable, Logger, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import {
  CepeaPriceDto,
  CepeaHistoricalSeriesDto,
  CepeaMarketIndicatorDto,
} from '../dto/cepea-price.dto';

/**
 * Serviço de integração com CEPEA
 * (Centro de Estudos Avançados em Economia Aplicada - ESALQ/USP)
 * 
 * Fornece indicadores de preços agrícolas no mercado brasileiro:
 * - Preços spot e futuros
 * - Séries históricas
 * - Indicadores de mercado
 * - Análises de tendência
 * 
 * NOTA: CEPEA não possui API pública oficial.
 * Este serviço usa web scraping ou endpoints não-documentados.
 */
@Injectable()
export class CepeaService {
  private readonly logger = new Logger(CepeaService.name);
  private readonly baseUrl = process.env.CEPEA_API_URL || 'https://www.cepea.esalq.usp.br/api';

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Obter preço atual de commodity
   * Cache: 1 hora (preços atualizados diariamente)
   */
  async getCurrentPrice(
    commodity: string,
    market: string = 'PARANAGUA',
  ): Promise<CepeaPriceDto> {
    const cacheKey = `cepea:current:${commodity}:${market}`;
    const cached = await this.cacheManager.get<CepeaPriceDto>(cacheKey);
    if (cached) return cached;

    try {
      this.logger.log(`Fetching CEPEA price for ${commodity} at ${market}`);

      // TODO: Implementar web scraping ou API call
      // const response = await firstValueFrom(
      //   this.httpService.get(`${this.baseUrl}/prices`, {
      //     params: { commodity, market },
      //   }),
      // );

      // Mock data
      const price: CepeaPriceDto = {
        commodity: commodity.toUpperCase(),
        market: market.toUpperCase(),
        date: new Date(),
        price: this.getBasePrice(commodity),
        unit: this.getPriceUnit(commodity),
        changePercent: (Math.random() - 0.5) * 5,
        volumeNegotiated: Math.random() * 100000,
        priceType: 'SPOT',
      };

      await this.cacheManager.set(cacheKey, price, 3600000); // 1h
      return price;
    } catch (error) {
      this.logger.error(`Failed to fetch CEPEA price for ${commodity}:`, error.message);
      throw new Error(`Failed to fetch CEPEA price: ${error.message}`);
    }
  }

  /**
   * Obter série histórica de preços
   * Cache: 6 horas
   */
  async getHistoricalSeries(
    commodity: string,
    market: string,
    startDate: Date,
    endDate: Date,
  ): Promise<CepeaHistoricalSeriesDto> {
    const cacheKey = `cepea:historical:${commodity}:${market}:${startDate.toISOString()}`;
    const cached = await this.cacheManager.get<CepeaHistoricalSeriesDto>(cacheKey);
    if (cached) return cached;

    try {
      this.logger.log(`Fetching CEPEA historical series for ${commodity}`);

      // Mock data - gerar série diária
      const prices: CepeaPriceDto[] = [];
      const currentDate = new Date(startDate);
      const basePrice = this.getBasePrice(commodity);

      while (currentDate <= endDate) {
        // Simular variação de preço (random walk)
        const variation = (Math.random() - 0.5) * 5;
        const price = basePrice * (1 + variation / 100);

        prices.push({
          commodity: commodity.toUpperCase(),
          market: market.toUpperCase(),
          date: new Date(currentDate),
          price,
          unit: this.getPriceUnit(commodity),
          changePercent: variation,
          priceType: 'SPOT',
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Calcular estatísticas
      const priceValues = prices.map((p) => p.price);
      const avgPrice = priceValues.reduce((sum, p) => sum + p, 0) / priceValues.length;
      const maxPrice = Math.max(...priceValues);
      const minPrice = Math.min(...priceValues);
      
      // Volatilidade (desvio padrão)
      const variance = priceValues.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / priceValues.length;
      const volatility = Math.sqrt(variance);

      const series: CepeaHistoricalSeriesDto = {
        commodity: commodity.toUpperCase(),
        market: market.toUpperCase(),
        startDate,
        endDate,
        prices,
        averagePrice: avgPrice,
        maxPrice,
        minPrice,
        volatility,
      };

      await this.cacheManager.set(cacheKey, series, 21600000); // 6h
      return series;
    } catch (error) {
      this.logger.error('Failed to fetch CEPEA historical series:', error.message);
      throw new Error(`Failed to fetch historical series: ${error.message}`);
    }
  }

  /**
   * Obter indicadores de mercado consolidados
   * Inclui análise de tendência e sentimento
   */
  async getMarketIndicator(commodity: string): Promise<CepeaMarketIndicatorDto> {
    const cacheKey = `cepea:indicator:${commodity}`;
    const cached = await this.cacheManager.get<CepeaMarketIndicatorDto>(cacheKey);
    if (cached) return cached;

    try {
      this.logger.log(`Calculating market indicator for ${commodity}`);

      // Obter histórico recente
      const endDate = new Date();
      const startDate30 = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      const startDate7 = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

      const series30 = await this.getHistoricalSeries(commodity, 'PARANAGUA', startDate30, endDate);
      const series7 = await this.getHistoricalSeries(commodity, 'PARANAGUA', startDate7, endDate);

      const currentPrice = series30.prices[series30.prices.length - 1].price;
      const price7daysAgo = series7.prices[0].price;
      const price30daysAgo = series30.prices[0].price;

      const trend7days = ((currentPrice - price7daysAgo) / price7daysAgo) * 100;
      const trend30days = ((currentPrice - price30daysAgo) / price30daysAgo) * 100;

      // Determinar sentimento
      let sentiment: string;
      if (trend30days > 5 && trend7days > 2) {
        sentiment = 'BULLISH';
      } else if (trend30days < -5 && trend7days < -2) {
        sentiment = 'BEARISH';
      } else {
        sentiment = 'NEUTRAL';
      }

      const indicator: CepeaMarketIndicatorDto = {
        commodity: commodity.toUpperCase(),
        date: new Date(),
        spotPrice: currentPrice,
        futurePrice: currentPrice * (1 + Math.random() * 0.05), // Mock
        basisPoints: (Math.random() - 0.5) * 10,
        trend7days,
        trend30days,
        sentiment,
      };

      await this.cacheManager.set(cacheKey, indicator, 3600000); // 1h
      return indicator;
    } catch (error) {
      this.logger.error('Failed to calculate market indicator:', error.message);
      throw new Error(`Failed to calculate market indicator: ${error.message}`);
    }
  }

  /**
   * Comparar preços entre diferentes mercados
   */
  async compareMarkets(commodity: string, markets: string[]): Promise<CepeaPriceDto[]> {
    return Promise.all(
      markets.map((market) => this.getCurrentPrice(commodity, market)),
    );
  }

  /**
   * Obter todas as commodities disponíveis
   */
  async getAvailableCommodities(): Promise<string[]> {
    return [
      'SOJA',
      'MILHO',
      'CAFE_ARABICA',
      'CAFE_ROBUSTA',
      'TRIGO',
      'ALGODAO',
      'BOI_GORDO',
      'SUINO',
      'FRANGO',
      'LEITE',
      'ACUCAR',
      'ETANOL',
    ];
  }

  /**
   * Obter mercados principais por commodity
   */
  async getMarketsByCommodity(commodity: string): Promise<string[]> {
    const marketMap: Record<string, string[]> = {
      SOJA: ['PARANAGUA', 'PASSO_FUNDO', 'CASCAVEL', 'RIO_VERDE'],
      MILHO: ['CAMPINAS', 'CASCAVEL', 'DOURADOS', 'SORRISO'],
      CAFE_ARABICA: ['MOGIANA', 'SUL_MINAS', 'CERRADO'],
      BOI_GORDO: ['SAO_PAULO', 'GOIAS', 'MATO_GROSSO'],
    };

    return marketMap[commodity.toUpperCase()] || ['PARANAGUA'];
  }

  // Helpers
  private getBasePrice(commodity: string): number {
    const basePrices: Record<string, number> = {
      SOJA: 135.50,          // R$/saca
      MILHO: 68.30,          // R$/saca
      CAFE_ARABICA: 1250.00, // R$/saca
      CAFE_ROBUSTA: 850.00,  // R$/saca
      TRIGO: 85.40,          // R$/saca
      ALGODAO: 165.20,       // R$/arroba
      BOI_GORDO: 305.50,     // R$/arroba
      SUINO: 185.30,         // R$/arroba
      FRANGO: 7.80,          // R$/kg
      LEITE: 2.45,           // R$/litro
      ACUCAR: 95.20,         // R$/saca
      ETANOL: 2.80,          // R$/litro
    };

    return basePrices[commodity.toUpperCase()] || 100;
  }

  private getPriceUnit(commodity: string): string {
    const units: Record<string, string> = {
      SOJA: 'saca',
      MILHO: 'saca',
      CAFE_ARABICA: 'saca',
      CAFE_ROBUSTA: 'saca',
      TRIGO: 'saca',
      ALGODAO: 'arroba',
      BOI_GORDO: 'arroba',
      SUINO: 'arroba',
      FRANGO: 'kg',
      LEITE: 'litro',
      ACUCAR: 'saca',
      ETANOL: 'litro',
    };

    return units[commodity.toUpperCase()] || 'unidade';
  }
}
