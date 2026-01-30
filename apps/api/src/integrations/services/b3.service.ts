import { Injectable, Logger, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import { B3QuoteDto, B3FuturesDto } from '../dto/b3-quote.dto';

/**
 * Serviço de integração com B3 (Brasil, Bolsa, Balcão)
 * 
 * Endpoints principais:
 * - Cotações em tempo real (spot)
 * - Contratos futuros de commodities agrícolas
 * - Histórico de preços
 * - Volume e open interest
 * 
 * NOTA: API B3 real requer autenticação. Este é um mock structure.
 */
@Injectable()
export class B3Service {
  private readonly logger = new Logger(B3Service.name);
  private readonly baseUrl = process.env.B3_API_URL || 'https://www.b3.com.br/api';
  private readonly apiKey = process.env.B3_API_KEY;

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Obter cotação spot de ação/commodity
   * Cache: 5 minutos
   */
  async getQuote(symbol: string): Promise<B3QuoteDto> {
    const cacheKey = `b3:quote:${symbol}`;
    const cached = await this.cacheManager.get<B3QuoteDto>(cacheKey);
    if (cached) return cached;

    try {
      this.logger.log(`Fetching B3 quote for ${symbol}`);
      
      // TODO: Implementar chamada real à API B3
      // const response = await firstValueFrom(
      //   this.httpService.get(`${this.baseUrl}/quotes/${symbol}`, {
      //     headers: { 'X-API-Key': this.apiKey },
      //   }),
      // );

      // Mock data para desenvolvimento
      const quote: B3QuoteDto = {
        symbol,
        name: this.getCommodityName(symbol),
        lastPrice: this.generateMockPrice(symbol),
        changePercent: (Math.random() - 0.5) * 5,
        volume: Math.floor(Math.random() * 1000000),
        high: 0,
        low: 0,
        open: 0,
        timestamp: new Date(),
        currency: 'BRL',
      };

      quote.high = quote.lastPrice * (1 + Math.random() * 0.02);
      quote.low = quote.lastPrice * (1 - Math.random() * 0.02);
      quote.open = quote.lastPrice * (1 + (Math.random() - 0.5) * 0.01);

      await this.cacheManager.set(cacheKey, quote, 300000); // 5 min
      return quote;
    } catch (error) {
      this.logger.error(`Failed to fetch B3 quote for ${symbol}:`, error.message);
      throw new Error(`Failed to fetch B3 quote: ${error.message}`);
    }
  }

  /**
   * Obter contratos futuros de commodity
   * Cache: 10 minutos
   */
  async getFutures(commodity: string, limit = 5): Promise<B3FuturesDto[]> {
    const cacheKey = `b3:futures:${commodity}:${limit}`;
    const cached = await this.cacheManager.get<B3FuturesDto[]>(cacheKey);
    if (cached) return cached;

    try {
      this.logger.log(`Fetching B3 futures for ${commodity}`);

      // Mock data - próximos 5 vencimentos
      const futures: B3FuturesDto[] = [];
      const months = ['F', 'G', 'H', 'J', 'K', 'M', 'N', 'Q', 'U', 'V', 'X', 'Z'];
      const currentDate = new Date();

      for (let i = 0; i < limit; i++) {
        const expirationDate = new Date(currentDate);
        expirationDate.setMonth(expirationDate.getMonth() + i + 1);
        
        const monthCode = months[expirationDate.getMonth()];
        const yearCode = expirationDate.getFullYear().toString().slice(-2);
        const contract = `${this.getCommodityCode(commodity)}${monthCode}${yearCode}`;

        const basePrice = this.generateMockPrice(commodity);
        
        futures.push({
          commodity,
          contract,
          expirationDate,
          price: basePrice * (1 + i * 0.01), // Pequeno prêmio por vencimento
          changePercent: (Math.random() - 0.5) * 3,
          volume: Math.floor(Math.random() * 500000),
          openInterest: Math.floor(Math.random() * 10000),
          timestamp: new Date(),
        });
      }

      await this.cacheManager.set(cacheKey, futures, 600000); // 10 min
      return futures;
    } catch (error) {
      this.logger.error(`Failed to fetch B3 futures for ${commodity}:`, error.message);
      throw new Error(`Failed to fetch B3 futures: ${error.message}`);
    }
  }

  /**
   * Obter múltiplas cotações de uma vez
   */
  async getBatchQuotes(symbols: string[]): Promise<B3QuoteDto[]> {
    return Promise.all(symbols.map((symbol) => this.getQuote(symbol)));
  }

  /**
   * Verificar se mercado está aberto (B3: 10h-17h30 horário de Brasília)
   */
  isMarketOpen(): boolean {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    // Segunda a Sexta
    if (day === 0 || day === 6) return false;

    // 10h - 17h30
    return hour >= 10 && hour < 18;
  }

  // Helpers
  private getCommodityName(symbol: string): string {
    const names: Record<string, string> = {
      SOJA: 'Soja',
      SOJ: 'Soja Futura',
      CORN: 'Milho',
      CCM: 'Milho Futura',
      CAFE: 'Café Arábica',
      ICF: 'Café Futura',
      WHEAT: 'Trigo',
      COTTON: 'Algodão',
    };
    return names[symbol] || symbol;
  }

  private getCommodityCode(commodity: string): string {
    const codes: Record<string, string> = {
      SOJA: 'SOJ',
      MILHO: 'CCM',
      CAFE: 'ICF',
      TRIGO: 'WTI',
      ALGODAO: 'CTN',
    };
    return codes[commodity.toUpperCase()] || commodity.slice(0, 3).toUpperCase();
  }

  private generateMockPrice(commodity: string): number {
    const basePrices: Record<string, number> = {
      SOJA: 120.50,
      SOJ: 121.00,
      MILHO: 65.30,
      CCM: 66.00,
      CAFE: 850.00,
      ICF: 860.00,
      TRIGO: 45.20,
      ALGODAO: 95.40,
    };
    const basePrice = basePrices[commodity.toUpperCase()] || 100;
    return basePrice * (1 + (Math.random() - 0.5) * 0.02);
  }
}
