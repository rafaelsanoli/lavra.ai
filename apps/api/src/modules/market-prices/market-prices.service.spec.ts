import { Test, TestingModule } from '@nestjs/testing';
import { MarketPricesService } from './market-prices.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('MarketPricesService', () => {
  let service: MarketPricesService;
  let prisma: PrismaService;

  const mockPriceId = 'price-123';
  const mockPrice = {
    id: mockPriceId,
    commodity: 'Soja',
    market: 'CBOT',
    price: 150.5,
    currency: 'BRL',
    unit: 'kg',
    timestamp: new Date('2026-01-29'),
    source: 'CEPEA',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketPricesService,
        {
          provide: PrismaService,
          useValue: {
            marketPrice: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<MarketPricesService>(MarketPricesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createInput = {
      commodity: 'Soja',
      market: 'CBOT',
      price: 150.5,
      currency: 'BRL',
      unit: 'kg',
      timestamp: '2026-01-29T00:00:00.000Z',
      source: 'CEPEA',
    };

    it('deve criar um preço de mercado com sucesso', async () => {
      jest.spyOn(prisma.marketPrice, 'create').mockResolvedValue(mockPrice as any);

      const result = await service.create(createInput);

      expect(result).toEqual(mockPrice);
      expect(prisma.marketPrice.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          commodity: 'Soja',
          timestamp: expect.any(Date),
        }),
      });
    });
  });

  describe('findAll', () => {
    it('deve listar todos os preços', async () => {
      jest.spyOn(prisma.marketPrice, 'findMany').mockResolvedValue([mockPrice] as any);

      const result = await service.findAll();

      expect(result).toEqual([mockPrice]);
    });

    it('deve filtrar por commodity', async () => {
      jest.spyOn(prisma.marketPrice, 'findMany').mockResolvedValue([mockPrice] as any);

      await service.findAll('Soja');

      expect(prisma.marketPrice.findMany).toHaveBeenCalledWith({
        where: { commodity: 'Soja' },
        orderBy: { timestamp: 'desc' },
      });
    });

    it('deve filtrar por mercado', async () => {
      jest.spyOn(prisma.marketPrice, 'findMany').mockResolvedValue([mockPrice] as any);

      await service.findAll(undefined, 'CBOT');

      expect(prisma.marketPrice.findMany).toHaveBeenCalledWith({
        where: { market: 'CBOT' },
        orderBy: { timestamp: 'desc' },
      });
    });

    it('deve filtrar por período', async () => {
      jest.spyOn(prisma.marketPrice, 'findMany').mockResolvedValue([mockPrice] as any);

      await service.findAll(undefined, undefined, '2026-01-01', '2026-01-31');

      expect(prisma.marketPrice.findMany).toHaveBeenCalledWith({
        where: {
          timestamp: {
            gte: new Date('2026-01-01'),
            lte: new Date('2026-01-31'),
          },
        },
        orderBy: { timestamp: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um preço específico', async () => {
      jest.spyOn(prisma.marketPrice, 'findUnique').mockResolvedValue(mockPrice as any);

      const result = await service.findOne(mockPriceId);

      expect(result).toEqual(mockPrice);
    });

    it('deve falhar se o preço não existir', async () => {
      jest.spyOn(prisma.marketPrice, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(mockPriceId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar um preço com sucesso', async () => {
      jest.spyOn(prisma.marketPrice, 'findUnique').mockResolvedValue(mockPrice as any);
      jest.spyOn(prisma.marketPrice, 'update').mockResolvedValue({
        ...mockPrice,
        price: 160,
      } as any);

      const result = await service.update(mockPriceId, { price: 160 });

      expect(result.price).toBe(160);
    });

    it('deve falhar se o preço não existir', async () => {
      jest.spyOn(prisma.marketPrice, 'findUnique').mockResolvedValue(null);

      await expect(service.update(mockPriceId, { price: 160 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deve remover um preço com sucesso', async () => {
      jest.spyOn(prisma.marketPrice, 'findUnique').mockResolvedValue(mockPrice as any);
      jest.spyOn(prisma.marketPrice, 'delete').mockResolvedValue(mockPrice as any);

      const result = await service.remove(mockPriceId);

      expect(result).toEqual(mockPrice);
    });

    it('deve falhar se o preço não existir', async () => {
      jest.spyOn(prisma.marketPrice, 'findUnique').mockResolvedValue(null);

      await expect(service.remove(mockPriceId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getLatestPrice', () => {
    it('deve retornar o último preço de uma commodity', async () => {
      jest.spyOn(prisma.marketPrice, 'findFirst').mockResolvedValue(mockPrice as any);

      const result = await service.getLatestPrice('Soja');

      expect(result).toEqual(mockPrice);
    });

    it('deve filtrar por mercado quando fornecido', async () => {
      jest.spyOn(prisma.marketPrice, 'findFirst').mockResolvedValue(mockPrice as any);

      await service.getLatestPrice('Soja', 'CBOT');

      expect(prisma.marketPrice.findFirst).toHaveBeenCalledWith({
        where: { commodity: 'Soja', market: 'CBOT' },
        orderBy: { timestamp: 'desc' },
      });
    });

    it('deve falhar se não encontrar preço', async () => {
      jest.spyOn(prisma.marketPrice, 'findFirst').mockResolvedValue(null);

      await expect(service.getLatestPrice('Milho')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPriceTrend', () => {
    it('deve calcular tendência de alta', async () => {
      const oldPrice = { ...mockPrice, price: 100, timestamp: new Date('2026-01-22') };
      const newPrice = { ...mockPrice, price: 150, timestamp: new Date('2026-01-29') };

      jest
        .spyOn(prisma.marketPrice, 'findFirst')
        .mockResolvedValueOnce(newPrice as any)
        .mockResolvedValueOnce(oldPrice as any);

      const result = await service.getPriceTrend('Soja');

      expect(result.trend).toBe('UP');
      expect(result.changePercent).toBe(50);
      expect(result.currentPrice).toBe(150);
      expect(result.previousPrice).toBe(100);
    });

    it('deve calcular tendência de baixa', async () => {
      const oldPrice = { ...mockPrice, price: 150, timestamp: new Date('2026-01-22') };
      const newPrice = { ...mockPrice, price: 100, timestamp: new Date('2026-01-29') };

      jest
        .spyOn(prisma.marketPrice, 'findFirst')
        .mockResolvedValueOnce(newPrice as any)
        .mockResolvedValueOnce(oldPrice as any);

      const result = await service.getPriceTrend('Soja');

      expect(result.trend).toBe('DOWN');
      expect(result.changePercent).toBe(-33.33);
    });

    it('deve retornar STABLE quando não há preço anterior', async () => {
      jest
        .spyOn(prisma.marketPrice, 'findFirst')
        .mockResolvedValueOnce(mockPrice as any)
        .mockResolvedValueOnce(null);

      const result = await service.getPriceTrend('Soja');

      expect(result.trend).toBe('STABLE');
      expect(result.changePercent).toBe(0);
    });

    it('deve falhar se não encontrar preço atual', async () => {
      jest.spyOn(prisma.marketPrice, 'findFirst').mockResolvedValue(null);

      await expect(service.getPriceTrend('Milho')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPriceStatistics', () => {
    const prices = [
      { ...mockPrice, price: 100 },
      { ...mockPrice, price: 150 },
      { ...mockPrice, price: 200 },
    ];

    it('deve calcular estatísticas corretamente', async () => {
      jest.spyOn(prisma.marketPrice, 'findMany').mockResolvedValue(prices as any);

      const result = await service.getPriceStatistics('Soja');

      expect(result.minPrice).toBe(100);
      expect(result.maxPrice).toBe(200);
      expect(result.avgPrice).toBe(150);
      expect(result.count).toBe(3);
    });

    it('deve retornar zeros quando não houver dados', async () => {
      jest.spyOn(prisma.marketPrice, 'findMany').mockResolvedValue([]);

      const result = await service.getPriceStatistics('Milho');

      expect(result.minPrice).toBe(0);
      expect(result.maxPrice).toBe(0);
      expect(result.avgPrice).toBe(0);
      expect(result.count).toBe(0);
    });
  });

  describe('getAvailableCommodities', () => {
    it('deve listar commodities disponíveis', async () => {
      jest.spyOn(prisma.marketPrice, 'findMany').mockResolvedValue([
        { commodity: 'Soja' },
        { commodity: 'Milho' },
        { commodity: 'Café' },
      ] as any);

      const result = await service.getAvailableCommodities();

      expect(result).toEqual(['Soja', 'Milho', 'Café']);
    });
  });
});
