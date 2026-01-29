import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PlotsService } from '../plots.service';
import { PrismaService } from '../../../prisma/prisma.service';

/**
 * Suite de testes unitários para PlotsService.
 * 
 * Testa todos os cenários de sucesso e erro para operações CRUD de talhões.
 * Usa mocks do Prisma para isolar lógica de negócio.
 */
describe('PlotsService', () => {
  let service: PlotsService;
  let prisma: PrismaService;

  // Mock data
  const mockUserId = 'user-123';
  const mockFarmId = 'farm-456';
  const mockPlotId = 'plot-789';

  const mockFarm = {
    id: mockFarmId,
    name: 'Fazenda Teste',
    location: 'São Paulo',
    latitude: -23.5,
    longitude: -46.6,
    totalArea: 100,
    userId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
    plots: [],
  };

  const mockPlot = {
    id: mockPlotId,
    name: 'Talhão Norte',
    farmId: mockFarmId,
    area: 50.5,
    soilType: 'Argiloso',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlotsService,
        {
          provide: PrismaService,
          useValue: {
            farm: {
              findFirst: jest.fn(),
              findUnique: jest.fn(),
            },
            plot: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            planting: {
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PlotsService>(PlotsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createPlotDto = {
      name: 'Talhão Novo',
      farmId: mockFarmId,
      area: 25.5,
      soilType: 'Arenoso',
    };

    it('deve criar um talhão com sucesso', async () => {
      const farmWithPlots = {
        ...mockFarm,
        plots: [{ ...mockPlot, area: 30 }], // Já usa 30ha
      };

      jest.spyOn(prisma.farm, 'findFirst').mockResolvedValue(farmWithPlots as any);
      jest.spyOn(prisma.plot, 'create').mockResolvedValue({
        ...mockPlot,
        ...createPlotDto,
        farm: mockFarm,
        plantings: [],
      } as any);

      const result = await service.create(mockUserId, createPlotDto);

      expect(result.name).toBe(createPlotDto.name);
      expect(prisma.farm.findFirst).toHaveBeenCalledWith({
        where: { id: mockFarmId, userId: mockUserId },
        include: { plots: true },
      });
      expect(prisma.plot.create).toHaveBeenCalled();
    });

    it('deve lançar NotFoundException se fazenda não existe', async () => {
      jest.spyOn(prisma.farm, 'findFirst').mockResolvedValue(null);

      await expect(service.create(mockUserId, createPlotDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar BadRequestException se nome duplicado', async () => {
      const farmWithPlots = {
        ...mockFarm,
        plots: [{ ...mockPlot, name: 'Talhão Novo' }], // Nome igual
      };

      jest.spyOn(prisma.farm, 'findFirst').mockResolvedValue(farmWithPlots as any);

      await expect(service.create(mockUserId, createPlotDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar BadRequestException se área excede total da fazenda', async () => {
      const farmWithPlots = {
        ...mockFarm,
        totalArea: 100,
        plots: [
          { ...mockPlot, area: 50 },
          { ...mockPlot, id: 'plot-2', area: 40 },
        ], // Já usa 90ha
      };

      const largePlotDto = {
        ...createPlotDto,
        area: 20, // 90 + 20 = 110 > 100
      };

      jest.spyOn(prisma.farm, 'findFirst').mockResolvedValue(farmWithPlots as any);

      await expect(service.create(mockUserId, largePlotDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(mockUserId, largePlotDto)).rejects.toThrow(
        /excede área da fazenda/,
      );
    });

    it('deve aceitar área exatamente igual ao disponível', async () => {
      const farmWithPlots = {
        ...mockFarm,
        totalArea: 100,
        plots: [{ ...mockPlot, area: 75 }], // Usa 75ha, sobram 25ha
      };

      const exactPlotDto = {
        ...createPlotDto,
        area: 25, // Exatamente o disponível
      };

      jest.spyOn(prisma.farm, 'findFirst').mockResolvedValue(farmWithPlots as any);
      jest.spyOn(prisma.plot, 'create').mockResolvedValue({
        ...mockPlot,
        ...exactPlotDto,
      } as any);

      const result = await service.create(mockUserId, exactPlotDto);

      expect(result).toBeDefined();
      expect(prisma.plot.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os talhões do usuário', async () => {
      const mockPlots = [
        { ...mockPlot, id: 'plot-1' },
        { ...mockPlot, id: 'plot-2' },
      ];

      jest.spyOn(prisma.plot, 'findMany').mockResolvedValue(mockPlots as any);

      const result = await service.findAll(mockUserId);

      expect(result).toHaveLength(2);
      expect(prisma.plot.findMany).toHaveBeenCalledWith({
        where: { farm: { userId: mockUserId } },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });

    it('deve filtrar por farmId quando fornecido', async () => {
      jest.spyOn(prisma.plot, 'findMany').mockResolvedValue([mockPlot] as any);

      await service.findAll(mockUserId, mockFarmId);

      expect(prisma.plot.findMany).toHaveBeenCalledWith({
        where: { farm: { userId: mockUserId }, farmId: mockFarmId },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });

    it('deve retornar array vazio se usuário não tem talhões', async () => {
      jest.spyOn(prisma.plot, 'findMany').mockResolvedValue([]);

      const result = await service.findAll(mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('deve retornar talhão por ID', async () => {
      jest.spyOn(prisma.plot, 'findFirst').mockResolvedValue({
        ...mockPlot,
        farm: mockFarm,
        plantings: [],
      } as any);

      const result = await service.findOne(mockPlotId, mockUserId);

      expect(result.id).toBe(mockPlotId);
      expect(prisma.plot.findFirst).toHaveBeenCalledWith({
        where: { id: mockPlotId, farm: { userId: mockUserId } },
        include: expect.any(Object),
      });
    });

    it('deve lançar NotFoundException se talhão não existe', async () => {
      jest.spyOn(prisma.plot, 'findFirst').mockResolvedValue(null);

      await expect(service.findOne('invalid-id', mockUserId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar NotFoundException se talhão não pertence ao usuário', async () => {
      jest.spyOn(prisma.plot, 'findFirst').mockResolvedValue(null);

      await expect(service.findOne(mockPlotId, 'other-user')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateDto = {
      name: 'Talhão Norte Atualizado',
      area: 55,
    };

    it('deve atualizar talhão com sucesso', async () => {
      jest.spyOn(prisma.plot, 'findFirst').mockResolvedValue({
        ...mockPlot,
        farm: mockFarm,
      } as any);
      jest.spyOn(prisma.farm, 'findUnique').mockResolvedValue({
        ...mockFarm,
        plots: [mockPlot],
      } as any);
      jest.spyOn(prisma.plot, 'update').mockResolvedValue({
        ...mockPlot,
        ...updateDto,
      } as any);

      const result = await service.update(mockPlotId, mockUserId, updateDto);

      expect(result.name).toBe(updateDto.name);
      expect(prisma.plot.update).toHaveBeenCalled();
    });

    it('deve validar área ao atualizar', async () => {
      const plotInFarm = { ...mockPlot, area: 30 };
      const farm = {
        ...mockFarm,
        totalArea: 100,
        plots: [
          plotInFarm,
          { ...mockPlot, id: 'plot-2', area: 60 },
        ],
      };

      jest.spyOn(prisma.plot, 'findFirst').mockResolvedValue({
        ...plotInFarm,
        farm,
      } as any);
      jest.spyOn(prisma.farm, 'findUnique').mockResolvedValue(farm as any);

      const largeUpdateDto = { area: 50 }; // 60 + 50 = 110 > 100

      await expect(
        service.update(mockPlotId, mockUserId, largeUpdateDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve permitir atualizar sem mudar área', async () => {
      jest.spyOn(prisma.plot, 'findFirst').mockResolvedValue({
        ...mockPlot,
        farm: mockFarm,
      } as any);
      jest.spyOn(prisma.plot, 'update').mockResolvedValue({
        ...mockPlot,
        name: 'Novo Nome',
      } as any);

      const noAreaUpdateDto = { name: 'Novo Nome' };

      const result = await service.update(mockPlotId, mockUserId, noAreaUpdateDto);

      expect(result).toBeDefined();
      expect(prisma.farm.findUnique).not.toHaveBeenCalled(); // Não valida área
    });
  });

  describe('remove', () => {
    it('deve remover talhão sem plantios ativos', async () => {
      jest.spyOn(prisma.plot, 'findFirst').mockResolvedValue({
        ...mockPlot,
        farm: mockFarm,
      } as any);
      jest.spyOn(prisma.planting, 'count').mockResolvedValue(0);
      jest.spyOn(prisma.plot, 'delete').mockResolvedValue(mockPlot as any);

      const result = await service.remove(mockPlotId, mockUserId);

      expect(result).toBe(true);
      expect(prisma.plot.delete).toHaveBeenCalledWith({
        where: { id: mockPlotId },
      });
    });

    it('deve lançar BadRequestException se há plantios ativos', async () => {
      jest.spyOn(prisma.plot, 'findFirst').mockResolvedValue({
        ...mockPlot,
        farm: mockFarm,
      } as any);
      jest.spyOn(prisma.planting, 'count').mockResolvedValue(2); // 2 plantios ativos

      await expect(service.remove(mockPlotId, mockUserId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.remove(mockPlotId, mockUserId)).rejects.toThrow(
        /plantio\(s\) ativo\(s\)/,
      );
      expect(prisma.plot.delete).not.toHaveBeenCalled();
    });

    it('deve permitir remover talhão com plantios finalizados', async () => {
      jest.spyOn(prisma.plot, 'findFirst').mockResolvedValue({
        ...mockPlot,
        farm: mockFarm,
      } as any);
      jest.spyOn(prisma.planting, 'count').mockResolvedValue(0); // Sem ativos
      jest.spyOn(prisma.plot, 'delete').mockResolvedValue(mockPlot as any);

      const result = await service.remove(mockPlotId, mockUserId);

      expect(result).toBe(true);
    });
  });
});
