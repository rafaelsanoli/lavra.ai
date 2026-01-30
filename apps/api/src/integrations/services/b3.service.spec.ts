import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { B3Service } from './b3.service';

describe('B3Service', () => {
  let service: B3Service;
  let httpService: HttpService;
  let cacheManager: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        B3Service,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
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

    service = module.get<B3Service>(B3Service);
    httpService = module.get<HttpService>(HttpService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getQuote', () => {
    it('should return cached quote if available', async () => {
      const cachedQuote = {
        symbol: 'SOJA',
        name: 'Soja',
        lastPrice: 120.5,
        changePercent: 1.5,
        volume: 1000000,
        high: 122.0,
        low: 119.0,
        open: 120.0,
        timestamp: new Date(),
        currency: 'BRL',
      };

      cacheManager.get.mockResolvedValue(cachedQuote);

      const result = await service.getQuote('SOJA');

      expect(result).toEqual(cachedQuote);
      expect(cacheManager.get).toHaveBeenCalledWith('b3:quote:SOJA');
      expect(cacheManager.set).not.toHaveBeenCalled();
    });

    it('should fetch and cache quote if not in cache', async () => {
      cacheManager.get.mockResolvedValue(null);

      const result = await service.getQuote('SOJA');

      expect(result).toBeDefined();
      expect(result.symbol).toBe('SOJA');
      expect(result.lastPrice).toBeGreaterThan(0);
      expect(cacheManager.set).toHaveBeenCalledWith(
        'b3:quote:SOJA',
        expect.any(Object),
        300000,
      );
    });

    it('should generate valid quote structure', async () => {
      cacheManager.get.mockResolvedValue(null);

      const result = await service.getQuote('MILHO');

      expect(result).toMatchObject({
        symbol: 'MILHO',
        name: expect.any(String),
        lastPrice: expect.any(Number),
        changePercent: expect.any(Number),
        volume: expect.any(Number),
        high: expect.any(Number),
        low: expect.any(Number),
        open: expect.any(Number),
        timestamp: expect.any(Date),
        currency: 'BRL',
      });
    });
  });

  describe('getFutures', () => {
    it('should return cached futures if available', async () => {
      const cachedFutures = [
        {
          commodity: 'SOJA',
          contract: 'SOJK24',
          expirationDate: new Date(),
          price: 121.0,
          changePercent: 1.0,
          volume: 500000,
          openInterest: 10000,
          timestamp: new Date(),
        },
      ];

      cacheManager.get.mockResolvedValue(cachedFutures);

      const result = await service.getFutures('SOJA', 5);

      expect(result).toEqual(cachedFutures);
      expect(cacheManager.get).toHaveBeenCalledWith('b3:futures:SOJA:5');
    });

    it('should generate multiple future contracts', async () => {
      cacheManager.get.mockResolvedValue(null);

      const result = await service.getFutures('MILHO', 3);

      expect(result).toHaveLength(3);
      expect(result[0].commodity).toBe('MILHO');
      expect(result[0].contract).toMatch(/^CCM[A-Z]\d{2}$/);
      expect(result[0].expirationDate).toBeInstanceOf(Date);
    });

    it('should generate contracts with increasing prices', async () => {
      cacheManager.get.mockResolvedValue(null);

      const result = await service.getFutures('SOJA', 5);

      for (let i = 1; i < result.length; i++) {
        expect(result[i].price).toBeGreaterThan(result[i - 1].price);
      }
    });
  });

  describe('getBatchQuotes', () => {
    it('should fetch multiple quotes', async () => {
      cacheManager.get.mockResolvedValue(null);

      const symbols = ['SOJA', 'MILHO', 'CAFE'];
      const result = await service.getBatchQuotes(symbols);

      expect(result).toHaveLength(3);
      expect(result[0].symbol).toBe('SOJA');
      expect(result[1].symbol).toBe('MILHO');
      expect(result[2].symbol).toBe('CAFE');
    });
  });

  describe('isMarketOpen', () => {
    it('should return false on weekends', () => {
      // Mock Date para Sábado
      const saturday = new Date('2024-01-06T12:00:00');
      jest.spyOn(global, 'Date').mockImplementation(() => saturday as any);

      const result = service.isMarketOpen();

      expect(result).toBe(false);

      jest.restoreAllMocks();
    });

    it('should return true during market hours (10h-18h)', () => {
      // Segunda-feira 14h
      const monday = new Date('2024-01-08T14:00:00');
      jest.spyOn(global, 'Date').mockImplementation(() => monday as any);

      const result = service.isMarketOpen();

      expect(result).toBe(true);

      jest.restoreAllMocks();
    });

    it('should return false outside market hours', () => {
      // Segunda-feira 8h
      const monday = new Date('2024-01-08T08:00:00');
      jest.spyOn(global, 'Date').mockImplementation(() => monday as any);

      const result = service.isMarketOpen();

      expect(result).toBe(false);

      jest.restoreAllMocks();
    });
  });
});
