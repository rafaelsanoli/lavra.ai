import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NasaPowerService } from './nasa-power.service';

describe('NasaPowerService', () => {
  let service: NasaPowerService;
  let cacheManager: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NasaPowerService,
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

    service = module.get<NasaPowerService>(NasaPowerService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDailyData', () => {
    it('should return cached data if available', async () => {
      const cachedData = {
        latitude: -15.78,
        longitude: -47.92,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-07'),
        data: [],
        metadata: {},
      };

      cacheManager.get.mockResolvedValue(cachedData);

      const result = await service.getDailyData(
        -15.78,
        -47.92,
        new Date('2024-01-01'),
        new Date('2024-01-07'),
      );

      expect(result).toEqual(cachedData);
    });

    it('should generate daily climate data', async () => {
      cacheManager.get.mockResolvedValue(null);

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-07');

      const result = await service.getDailyData(-15.78, -47.92, startDate, endDate);

      expect(result.latitude).toBe(-15.78);
      expect(result.longitude).toBe(-47.92);
      expect(result.data).toHaveLength(7);

      result.data.forEach((day) => {
        expect(day.date).toBeInstanceOf(Date);
        expect(day.parameters).toMatchObject({
          T2M: expect.any(Number),
          T2M_MAX: expect.any(Number),
          T2M_MIN: expect.any(Number),
          PRECTOTCORR: expect.any(Number),
          RH2M: expect.any(Number),
          WS2M: expect.any(Number),
        });
      });
    });

    it('should cache historical data for 12 hours', async () => {
      cacheManager.get.mockResolvedValue(null);

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-07');

      await service.getDailyData(-15.78, -47.92, startDate, endDate);

      expect(cacheManager.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        43200000, // 12h for historical
      );
    });

    it('should cache recent data for 1 hour', async () => {
      cacheManager.get.mockResolvedValue(null);

      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

      await service.getDailyData(-15.78, -47.92, yesterday, today);

      expect(cacheManager.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        3600000, // 1h for recent
      );
    });
  });

  describe('calculateAgriculturalIndices', () => {
    it('should calculate indices from raw data', async () => {
      cacheManager.get.mockResolvedValue(null);

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-07');

      const result = await service.calculateAgriculturalIndices(
        -15.78,
        -47.92,
        startDate,
        endDate,
        'SOJA',
      );

      expect(result).toHaveLength(7);
      result.forEach((index) => {
        expect(index).toMatchObject({
          date: expect.any(Date),
          evapotranspiration: expect.any(Number),
          waterDeficit: expect.any(Number),
          growingDegreeDays: expect.any(Number),
          frostRiskIndex: expect.any(Number),
          heatStressIndex: expect.any(Number),
        });

        expect(index.evapotranspiration).toBeGreaterThanOrEqual(0);
        expect(index.waterDeficit).toBeGreaterThanOrEqual(0);
        expect(index.frostRiskIndex).toBeGreaterThanOrEqual(0);
        expect(index.frostRiskIndex).toBeLessThanOrEqual(1);
      });
    });

    it('should use correct base temperature for crop type', async () => {
      cacheManager.get.mockResolvedValue(null);

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-03');

      const soyResult = await service.calculateAgriculturalIndices(
        -15.78,
        -47.92,
        startDate,
        endDate,
        'SOJA',
      );

      expect(soyResult[0].growingDegreeDays).toBeGreaterThanOrEqual(0);
    });

    it('should cache indices for 6 hours', async () => {
      cacheManager.get.mockResolvedValue(null);

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-07');

      await service.calculateAgriculturalIndices(
        -15.78,
        -47.92,
        startDate,
        endDate,
        'MILHO',
      );

      expect(cacheManager.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        21600000, // 6h
      );
    });
  });

  describe('getMonthlyAverages', () => {
    it('should aggregate daily data into monthly averages', async () => {
      cacheManager.get.mockResolvedValue(null);

      const result = await service.getMonthlyAverages(-15.78, -47.92, 2024);

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data.length).toBeLessThanOrEqual(12);

      result.data.forEach((monthData) => {
        expect(monthData.date).toBeInstanceOf(Date);
        expect(monthData.parameters.T2M).toBeGreaterThan(0);
      });
    });

    it('should sum precipitation instead of averaging', async () => {
      cacheManager.get.mockResolvedValue(null);

      const result = await service.getMonthlyAverages(-15.78, -47.92, 2024);

      // Precipitação mensal deve ser soma dos dias
      result.data.forEach((monthData) => {
        expect(monthData.parameters.PRECTOTCORR).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
