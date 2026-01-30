import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CepeaService } from './cepea.service';

describe('CepeaService', () => {
  let service: CepeaService;
  let cacheManager: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CepeaService,
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CepeaService>(CepeaService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentPrice', () => {
    it('should return cached price if available', async () => {
      const cachedPrice = {
        commodity: 'SOJA',
        market: 'PARANAGUA',
        date: new Date(),
        price: 135.5,
        unit: 'saca',
        changePercent: 1.5,
        priceType: 'SPOT',
      };

      cacheManager.get.mockResolvedValue(cachedPrice);

      const result = await service.getCurrentPrice('SOJA', 'PARANAGUA');

      expect(result).toEqual(cachedPrice);
    });

    it('should fetch and generate price data', async () => {
      cacheManager.get.mockResolvedValue(null);

      const result = await service.getCurrentPrice('SOJA', 'PARANAGUA');

      expect(result).toMatchObject({
        commodity: 'SOJA',
        market: 'PARANAGUA',
        date: expect.any(Date),
        price: expect.any(Number),
        unit: 'saca',
        priceType: 'SPOT',
      });
      expect(result.price).toBeGreaterThan(0);
    });

    it('should cache price for 1 hour', async () => {
      cacheManager.get.mockResolvedValue(null);

      await service.getCurrentPrice('MILHO', 'CAMPINAS');

      expect(cacheManager.set).toHaveBeenCalledWith(
        'cepea:current:MILHO:CAMPINAS',
        expect.any(Object),
        3600000, // 1h
      );
    });
  });

  describe('getHistoricalSeries', () => {
    it('should generate historical price series', async () => {
      cacheManager.get.mockResolvedValue(null);

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-07');

      const result = await service.getHistoricalSeries(
        'SOJA',
        'PARANAGUA',
        startDate,
        endDate,
      );

      expect(result).toMatchObject({
        commodity: 'SOJA',
        market: 'PARANAGUA',
        startDate,
        endDate,
        prices: expect.any(Array),
        averagePrice: expect.any(Number),
        maxPrice: expect.any(Number),
        minPrice: expect.any(Number),
        volatility: expect.any(Number),
      });

      expect(result.prices).toHaveLength(7);
      expect(result.maxPrice).toBeGreaterThanOrEqual(result.minPrice);
      expect(result.averagePrice).toBeGreaterThan(0);
    });

    it('should calculate correct statistics', async () => {
      cacheManager.get.mockResolvedValue(null);

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const result = await service.getHistoricalSeries(
        'MILHO',
        'CAMPINAS',
        startDate,
        endDate,
      );

      const prices = result.prices.map((p) => p.price);
      const calculatedMax = Math.max(...prices);
      const calculatedMin = Math.min(...prices);

      expect(result.maxPrice).toBe(calculatedMax);
      expect(result.minPrice).toBe(calculatedMin);
      expect(result.volatility).toBeGreaterThan(0);
    });

    it('should cache historical series for 6 hours', async () => {
      cacheManager.get.mockResolvedValue(null);

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-07');

      await service.getHistoricalSeries('CAFE_ARABICA', 'MOGIANA', startDate, endDate);

      expect(cacheManager.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        21600000, // 6h
      );
    });
  });

  describe('getMarketIndicator', () => {
    it('should calculate market indicator with trends', async () => {
      cacheManager.get.mockResolvedValue(null);

      const result = await service.getMarketIndicator('SOJA');

      expect(result).toMatchObject({
        commodity: 'SOJA',
        date: expect.any(Date),
        spotPrice: expect.any(Number),
        futurePrice: expect.any(Number),
        basisPoints: expect.any(Number),
        trend7days: expect.any(Number),
        trend30days: expect.any(Number),
        sentiment: expect.stringMatching(/^(BULLISH|BEARISH|NEUTRAL)$/),
      });
    });

    it('should determine BULLISH sentiment correctly', async () => {
      cacheManager.get.mockResolvedValue(null);

      // Mock para garantir tendência positiva
      jest.spyOn(service as any, 'getHistoricalSeries').mockImplementation(
        async (commodity, market, startDate, endDate) => {
          const prices = Array.from({ length: 30 }, (_, i) => ({
            commodity,
            market,
            date: new Date(),
            price: 100 + i * 2, // Preço crescente
            unit: 'saca',
            priceType: 'SPOT',
          }));

          return {
            commodity,
            market,
            startDate,
            endDate,
            prices,
            averagePrice: 115,
            maxPrice: 158,
            minPrice: 100,
            volatility: 5,
          };
        },
      );

      const result = await service.getMarketIndicator('SOJA');

      expect(result.sentiment).toBe('BULLISH');
      expect(result.trend7days).toBeGreaterThan(5);
      expect(result.trend30days).toBeGreaterThan(5);
    });

    it('should cache indicator for 1 hour', async () => {
      cacheManager.get.mockResolvedValue(null);

      await service.getMarketIndicator('MILHO');

      expect(cacheManager.set).toHaveBeenCalledWith(
        'cepea:indicator:MILHO',
        expect.any(Object),
        3600000,
      );
    });
  });

  describe('compareMarkets', () => {
    it('should fetch prices from multiple markets', async () => {
      cacheManager.get.mockResolvedValue(null);

      const markets = ['PARANAGUA', 'PASSO_FUNDO', 'CASCAVEL'];
      const result = await service.compareMarkets('SOJA', markets);

      expect(result).toHaveLength(3);
      expect(result[0].market).toBe('PARANAGUA');
      expect(result[1].market).toBe('PASSO_FUNDO');
      expect(result[2].market).toBe('CASCAVEL');
    });
  });

  describe('getAvailableCommodities', () => {
    it('should return list of commodities', async () => {
      const result = await service.getAvailableCommodities();

      expect(result).toBeInstanceOf(Array);
      expect(result).toContain('SOJA');
      expect(result).toContain('MILHO');
      expect(result).toContain('CAFE_ARABICA');
      expect(result.length).toBeGreaterThan(5);
    });
  });

  describe('getMarketsByCommodity', () => {
    it('should return markets for SOJA', async () => {
      const result = await service.getMarketsByCommodity('SOJA');

      expect(result).toBeInstanceOf(Array);
      expect(result).toContain('PARANAGUA');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return markets for CAFE_ARABICA', async () => {
      const result = await service.getMarketsByCommodity('CAFE_ARABICA');

      expect(result).toContain('MOGIANA');
      expect(result).toContain('SUL_MINAS');
    });

    it('should return default markets for unknown commodity', async () => {
      const result = await service.getMarketsByCommodity('UNKNOWN');

      expect(result).toEqual(['PARANAGUA']);
    });
  });
});
