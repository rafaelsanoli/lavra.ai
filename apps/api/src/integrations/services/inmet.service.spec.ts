import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InmetService } from './inmet.service';

describe('InmetService', () => {
  let service: InmetService;
  let cacheManager: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InmetService,
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

    service = module.get<InmetService>(InmetService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findNearbyStations', () => {
    it('should return cached stations if available', async () => {
      const cachedStations = [
        {
          code: 'A001',
          name: 'BRASILIA',
          latitude: -15.789,
          longitude: -47.926,
          uf: 'DF',
          municipality: 'BRASILIA',
        },
      ];

      cacheManager.get.mockResolvedValue(cachedStations);

      const result = await service.findNearbyStations(-15.78, -47.92, 100);

      expect(result).toEqual(cachedStations);
      expect(cacheManager.get).toHaveBeenCalled();
    });

    it('should find stations within radius', async () => {
      cacheManager.get.mockResolvedValue(null);

      const result = await service.findNearbyStations(-15.78, -47.92, 100);

      expect(result).toBeInstanceOf(Array);
      result.forEach((station) => {
        expect(station).toMatchObject({
          code: expect.any(String),
          name: expect.any(String),
          latitude: expect.any(Number),
          longitude: expect.any(Number),
          uf: expect.any(String),
          municipality: expect.any(String),
        });
      });
    });

    it('should cache stations for 24 hours', async () => {
      cacheManager.get.mockResolvedValue(null);

      await service.findNearbyStations(-15.78, -47.92, 100);

      expect(cacheManager.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        86400000, // 24h
      );
    });
  });

  describe('getCurrentWeather', () => {
    it('should return cached weather if available', async () => {
      const cachedWeather = {
        stationCode: 'A001',
        timestamp: new Date(),
        temperature: 25.5,
        humidity: 60,
        pressure: 1013,
        windSpeed: 5,
        windDirection: 180,
        precipitation: 0,
        solarRadiation: 500,
        condition: 'ensolarado',
      };

      cacheManager.get.mockResolvedValue(cachedWeather);

      const result = await service.getCurrentWeather('A001');

      expect(result).toEqual(cachedWeather);
    });

    it('should fetch and generate weather data', async () => {
      cacheManager.get.mockResolvedValue(null);

      const result = await service.getCurrentWeather('A001');

      expect(result).toMatchObject({
        stationCode: 'A001',
        timestamp: expect.any(Date),
        temperature: expect.any(Number),
        humidity: expect.any(Number),
        pressure: expect.any(Number),
        windSpeed: expect.any(Number),
        windDirection: expect.any(Number),
        condition: expect.any(String),
      });
    });

    it('should cache weather for 30 minutes', async () => {
      cacheManager.get.mockResolvedValue(null);

      await service.getCurrentWeather('A001');

      expect(cacheManager.set).toHaveBeenCalledWith(
        'inmet:current:A001',
        expect.any(Object),
        1800000, // 30 min
      );
    });
  });

  describe('getHistoricalWeather', () => {
    it('should generate daily historical data', async () => {
      cacheManager.get.mockResolvedValue(null);

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-07');

      const result = await service.getHistoricalWeather('A001', startDate, endDate);

      expect(result).toHaveLength(7);
      result.forEach((data) => {
        expect(data.stationCode).toBe('A001');
        expect(data.timestamp).toBeInstanceOf(Date);
        expect(data.temperature).toBeGreaterThan(0);
      });
    });

    it('should cache historical data for 6 hours', async () => {
      cacheManager.get.mockResolvedValue(null);

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-07');

      await service.getHistoricalWeather('A001', startDate, endDate);

      expect(cacheManager.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        21600000, // 6h
      );
    });
  });

  describe('getForecast', () => {
    it('should generate forecast for multiple days', async () => {
      cacheManager.get.mockResolvedValue(null);

      const result = await service.getForecast('BRASILIA', 'DF', 7);

      expect(result).toHaveLength(7);
      result.forEach((forecast) => {
        expect(forecast).toMatchObject({
          municipality: 'BRASILIA',
          uf: 'DF',
          date: expect.any(Date),
          minTemperature: expect.any(Number),
          maxTemperature: expect.any(Number),
          precipitationProbability: expect.any(Number),
          condition: expect.any(String),
        });
        expect(forecast.maxTemperature).toBeGreaterThan(forecast.minTemperature);
      });
    });

    it('should cache forecast for 3 hours', async () => {
      cacheManager.get.mockResolvedValue(null);

      await service.getForecast('BRASILIA', 'DF', 7);

      expect(cacheManager.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        10800000, // 3h
      );
    });
  });

  describe('getWeatherByCoordinates', () => {
    it('should find nearest station and return weather', async () => {
      cacheManager.get.mockResolvedValue(null);

      const result = await service.getWeatherByCoordinates(-15.78, -47.92);

      expect(result).toBeDefined();
      expect(result.stationCode).toBeDefined();
      expect(result.temperature).toBeGreaterThan(0);
    });

    it('should throw error if no station found', async () => {
      cacheManager.get.mockResolvedValue([]);

      await expect(
        service.getWeatherByCoordinates(0, 0),
      ).rejects.toThrow('No weather station found within 200km');
    });
  });
});
