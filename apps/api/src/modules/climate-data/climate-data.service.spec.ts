import { Test, TestingModule } from '@nestjs/testing';
import { ClimateDataService } from './climate-data.service';
import { PrismaService } from '../../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { NotFoundException, HttpException } from '@nestjs/common';
import { of } from 'rxjs';

describe('ClimateDataService', () => {
  let service: ClimateDataService;
  let prisma: PrismaService;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockUserId = 'user-123';
  const mockFarmId = 'farm-123';
  const mockClimateDataId = 'climate-123';

  const mockFarm = {
    id: mockFarmId,
    userId: mockUserId,
    name: 'Fazenda Teste',
    latitude: -23.5505,
    longitude: -46.6333,
  };

  const mockClimateData = {
    id: mockClimateDataId,
    farmId: mockFarmId,
    date: new Date('2026-01-15'),
    temperature: 28.5,
    humidity: 65,
    rainfall: 10.5,
    windSpeed: 15,
    solarRadiation: 850,
    source: 'Manual',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClimateDataService,
        {
          provide: PrismaService,
          useValue: {
            farm: {
              findFirst: jest.fn(),
            },
            climateData: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ClimateDataService>(ClimateDataService);
    prisma = module.get<PrismaService>(PrismaService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createInput = {
      farmId: mockFarmId,
      date: '2026-01-15',
      temperature: 28.5,
      humidity: 65,
      rainfall: 10.5,
    };

    it('deve criar um dado climático com sucesso', async () => {
      jest.spyOn(prisma.farm, 'findFirst').mockResolvedValue(mockFarm as any);
      jest.spyOn(prisma.climateData, 'create').mockResolvedValue(mockClimateData as any);

      const result = await service.create(mockUserId, createInput);

      expect(result).toEqual(mockClimateData);
      expect(prisma.farm.findFirst).toHaveBeenCalledWith({
        where: { id: mockFarmId, userId: mockUserId },
      });
    });

    it('deve falhar se a fazenda não existir', async () => {
      jest.spyOn(prisma.farm, 'findFirst').mockResolvedValue(null);

      await expect(service.create(mockUserId, createInput)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('deve listar todos os dados climáticos do usuário', async () => {
      jest.spyOn(prisma.climateData, 'findMany').mockResolvedValue([mockClimateData] as any);

      const result = await service.findAll(mockUserId);

      expect(result).toEqual([mockClimateData]);
      expect(prisma.climateData.findMany).toHaveBeenCalledWith({
        where: { farm: { userId: mockUserId } },
        orderBy: { date: 'desc' },
      });
    });

    it('deve filtrar por farmId quando fornecido', async () => {
      jest.spyOn(prisma.climateData, 'findMany').mockResolvedValue([mockClimateData] as any);

      await service.findAll(mockUserId, mockFarmId);

      expect(prisma.climateData.findMany).toHaveBeenCalledWith({
        where: { farm: { userId: mockUserId }, farmId: mockFarmId },
        orderBy: { date: 'desc' },
      });
    });

    it('deve filtrar por período de datas', async () => {
      jest.spyOn(prisma.climateData, 'findMany').mockResolvedValue([mockClimateData] as any);

      await service.findAll(mockUserId, undefined, '2026-01-01', '2026-01-31');

      expect(prisma.climateData.findMany).toHaveBeenCalledWith({
        where: {
          farm: { userId: mockUserId },
          date: {
            gte: new Date('2026-01-01'),
            lte: new Date('2026-01-31'),
          },
        },
        orderBy: { date: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um dado climático específico', async () => {
      jest.spyOn(prisma.climateData, 'findFirst').mockResolvedValue({
        ...mockClimateData,
        farm: mockFarm,
      } as any);

      const result = await service.findOne(mockClimateDataId, mockUserId);

      expect(result).toHaveProperty('farm');
    });

    it('deve falhar se o dado climático não existir', async () => {
      jest.spyOn(prisma.climateData, 'findFirst').mockResolvedValue(null);

      await expect(service.findOne(mockClimateDataId, mockUserId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateInput = {
      temperature: 30,
      humidity: 70,
    };

    it('deve atualizar um dado climático com sucesso', async () => {
      jest.spyOn(prisma.climateData, 'findFirst').mockResolvedValue({
        ...mockClimateData,
        farm: mockFarm,
      } as any);
      jest.spyOn(prisma.climateData, 'update').mockResolvedValue({
        ...mockClimateData,
        ...updateInput,
      } as any);

      const result = await service.update(mockClimateDataId, mockUserId, updateInput);

      expect(result.temperature).toBe(30);
      expect(result.humidity).toBe(70);
    });

    it('deve falhar se o dado climático não existir', async () => {
      jest.spyOn(prisma.climateData, 'findFirst').mockResolvedValue(null);

      await expect(service.update(mockClimateDataId, mockUserId, updateInput)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deve remover um dado climático com sucesso', async () => {
      jest.spyOn(prisma.climateData, 'findFirst').mockResolvedValue({
        ...mockClimateData,
        farm: mockFarm,
      } as any);
      jest.spyOn(prisma.climateData, 'delete').mockResolvedValue(mockClimateData as any);

      const result = await service.remove(mockClimateDataId, mockUserId);

      expect(result).toEqual(mockClimateData);
    });

    it('deve falhar se o dado climático não existir', async () => {
      jest.spyOn(prisma.climateData, 'findFirst').mockResolvedValue(null);

      await expect(service.remove(mockClimateDataId, mockUserId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('fetchFromOpenWeather', () => {
    const mockWeatherResponse = {
      data: {
        main: {
          temp: 28.5,
          humidity: 65,
        },
        rain: {
          '1h': 10.5,
        },
        wind: {
          speed: 15,
        },
      },
    };

    it('deve buscar dados do OpenWeather com sucesso', async () => {
      jest.spyOn(prisma.farm, 'findFirst').mockResolvedValue(mockFarm as any);
      jest.spyOn(configService, 'get').mockReturnValue('fake-api-key');
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockWeatherResponse) as any);
      jest.spyOn(prisma.climateData, 'create').mockResolvedValue(mockClimateData as any);

      const result = await service.fetchFromOpenWeather(mockFarmId, mockUserId);

      expect(result).toEqual(mockClimateData);
      expect(httpService.get).toHaveBeenCalled();
    });

    it('deve falhar se a fazenda não tiver coordenadas', async () => {
      jest.spyOn(prisma.farm, 'findFirst').mockResolvedValue({
        ...mockFarm,
        latitude: null,
        longitude: null,
      } as any);

      await expect(service.fetchFromOpenWeather(mockFarmId, mockUserId)).rejects.toThrow(HttpException);
    });

    it('deve falhar se a API key não estiver configurada', async () => {
      jest.spyOn(prisma.farm, 'findFirst').mockResolvedValue(mockFarm as any);
      jest.spyOn(configService, 'get').mockReturnValue(undefined);

      await expect(service.fetchFromOpenWeather(mockFarmId, mockUserId)).rejects.toThrow(HttpException);
    });
  });

  describe('getStatistics', () => {
    const mockDataList = [
      { ...mockClimateData, temperature: 25, humidity: 60, rainfall: 5, windSpeed: 10 },
      { ...mockClimateData, temperature: 30, humidity: 70, rainfall: 15, windSpeed: 20 },
    ];

    it('deve calcular estatísticas corretamente', async () => {
      jest.spyOn(prisma.climateData, 'findMany').mockResolvedValue(mockDataList as any);

      const result = await service.getStatistics(mockUserId, mockFarmId, '2026-01-01', '2026-01-31');

      expect(result.count).toBe(2);
      expect(result.avgTemperature).toBe(27.5);
      expect(result.avgHumidity).toBe(65);
      expect(result.totalRainfall).toBe(20);
      expect(result.avgWindSpeed).toBe(15);
    });

    it('deve retornar zeros quando não houver dados', async () => {
      jest.spyOn(prisma.climateData, 'findMany').mockResolvedValue([]);

      const result = await service.getStatistics(mockUserId, mockFarmId, '2026-01-01', '2026-01-31');

      expect(result.count).toBe(0);
      expect(result.avgTemperature).toBe(0);
    });
  });
});
