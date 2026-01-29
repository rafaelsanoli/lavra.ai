import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PlantingsService } from './plantings.service';
import { PrismaService } from '../../prisma/prisma.service';
import { LoggerService } from '../../common/logger/logger.service';
import { PlantingStatus } from './dto/update-planting.input';

describe('PlantingsService', () => {
  let service: PlantingsService;
  let prisma: PrismaService;
  let logger: LoggerService;

  const mockPrisma = {
    planting: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      aggregate: jest.fn()
    },
    plot: {
      findUnique: jest.fn()
    }
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    logDatabase: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlantingsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: LoggerService, useValue: mockLogger }
      ]
    }).compile();

    service = module.get<PlantingsService>(PlantingsService);
    prisma = module.get<PrismaService>(PrismaService);
    logger = module.get<LoggerService>(LoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const userId = 'user-123';
    const input = {
      plotId: 'plot-123',
      cropType: 'Soja',
      variety: 'Monsoy 6410',
      area: 10,
      plantingDate: '2025-10-01T00:00:00.000Z',
      expectedHarvest: '2026-02-01T00:00:00.000Z',
      estimatedYield: 3000
    };

    const mockPlot = {
      id: 'plot-123',
      name: 'Talhão Norte',
      area: 50,
      farm: {
        id: 'farm-123',
        userId: 'user-123'
      }
    };

    it('deve criar um plantio com sucesso', async () => {
      const mockPlanting = {
        id: 'planting-123',
        ...input,
        status: 'PLANNED',
        plot: {
          id: mockPlot.id,
          name: mockPlot.name,
          area: mockPlot.area
        },
        harvests: []
      };

      mockPrisma.plot.findUnique.mockResolvedValue(mockPlot);
      mockPrisma.planting.aggregate.mockResolvedValue({ _sum: { area: 0 } });
      mockPrisma.planting.create.mockResolvedValue(mockPlanting);

      const result = await service.create(userId, input);

      expect(result).toEqual(mockPlanting);
      expect(mockPrisma.plot.findUnique).toHaveBeenCalledWith({
        where: { id: input.plotId },
        include: { farm: true }
      });
      expect(mockLogger.logDatabase).toHaveBeenCalledWith('CREATE', 'Planting', {
        id: 'planting-123',
        cropType: 'Soja'
      });
    });

    it('deve falhar se o talhão não existir', async () => {
      mockPrisma.plot.findUnique.mockResolvedValue(null);

      await expect(service.create(userId, input)).rejects.toThrow(NotFoundException);
      await expect(service.create(userId, input)).rejects.toThrow('Talhão não encontrado');
    });

    it('deve falhar se o usuário não for dono do talhão', async () => {
      const plotWithDifferentUser = {
        ...mockPlot,
        farm: { ...mockPlot.farm, userId: 'other-user' }
      };

      mockPrisma.plot.findUnique.mockResolvedValue(plotWithDifferentUser);

      await expect(service.create(userId, input)).rejects.toThrow(ForbiddenException);
    });

    it('deve falhar se data de plantio >= data de colheita', async () => {
      const invalidInput = {
        ...input,
        plantingDate: '2026-02-01T00:00:00.000Z',
        expectedHarvest: '2025-10-01T00:00:00.000Z'
      };

      mockPrisma.plot.findUnique.mockResolvedValue(mockPlot);

      await expect(service.create(userId, invalidInput)).rejects.toThrow(BadRequestException);
      await expect(service.create(userId, invalidInput)).rejects.toThrow(
        'Data de plantio deve ser anterior à data esperada de colheita'
      );
    });

    it('deve falhar se área de plantio exceder área disponível', async () => {
      mockPrisma.plot.findUnique.mockResolvedValue(mockPlot);
      mockPrisma.planting.aggregate.mockResolvedValue({ _sum: { area: 45 } }); // 45 ha já usados

      const largeAreaInput = { ...input, area: 10 }; // Tenta plantar 10 ha (total 55 > 50)

      await expect(service.create(userId, largeAreaInput)).rejects.toThrow(BadRequestException);
      await expect(service.create(userId, largeAreaInput)).rejects.toThrow(/excede área disponível/);
    });

    it('deve calcular corretamente área disponível com plantios ativos', async () => {
      mockPrisma.plot.findUnique.mockResolvedValue(mockPlot);
      mockPrisma.planting.aggregate.mockResolvedValue({ _sum: { area: 30 } }); // 30 ha usados
      mockPrisma.planting.create.mockResolvedValue({
        id: 'planting-123',
        ...input,
        plot: mockPlot,
        harvests: []
      });

      const validInput = { ...input, area: 20 }; // 30 + 20 = 50 (OK)

      await service.create(userId, validInput);

      expect(mockPrisma.planting.aggregate).toHaveBeenCalledWith({
        where: {
          plotId: input.plotId,
          status: { in: ['PLANNED', 'IN_PROGRESS'] }
        },
        _sum: { area: true }
      });
    });
  });

  describe('findAll', () => {
    const userId = 'user-123';

    it('deve listar todos os plantios do usuário', async () => {
      const mockPlantings = [
        {
          id: 'planting-1',
          cropType: 'Soja',
          status: 'IN_PROGRESS',
          plot: { id: 'plot-1', name: 'Talhão 1', area: 50 }
        },
        {
          id: 'planting-2',
          cropType: 'Milho',
          status: 'PLANNED',
          plot: { id: 'plot-2', name: 'Talhão 2', area: 30 }
        }
      ];

      mockPrisma.planting.findMany.mockResolvedValue(mockPlantings);

      const result = await service.findAll(userId);

      expect(result).toEqual(mockPlantings);
      expect(mockPrisma.planting.findMany).toHaveBeenCalledWith({
        where: {
          plot: {
            farm: { userId }
          }
        },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' }
      });
    });

    it('deve filtrar por talhão quando plotId é fornecido', async () => {
      const plotId = 'plot-123';
      mockPrisma.planting.findMany.mockResolvedValue([]);

      await service.findAll(userId, plotId);

      expect(mockPrisma.planting.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            plotId
          })
        })
      );
    });

    it('deve filtrar por status quando fornecido', async () => {
      const status = PlantingStatus.HARVESTED;
      mockPrisma.planting.findMany.mockResolvedValue([]);

      await service.findAll(userId, undefined, status);

      expect(mockPrisma.planting.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status
          })
        })
      );
    });
  });

  describe('findOne', () => {
    const userId = 'user-123';
    const plantingId = 'planting-123';

    it('deve retornar um plantio específico', async () => {
      const mockPlanting = {
        id: plantingId,
        cropType: 'Soja',
        plot: {
          id: 'plot-123',
          name: 'Talhão Norte',
          area: 50,
          farm: {
            userId
          }
        },
        harvests: []
      };

      mockPrisma.planting.findUnique.mockResolvedValue(mockPlanting);

      const result = await service.findOne(userId, plantingId);

      expect(result).toBeDefined();
      expect(result.id).toBe(plantingId);
    });

    it('deve falhar se plantio não existir', async () => {
      mockPrisma.planting.findUnique.mockResolvedValue(null);

      await expect(service.findOne(userId, 'fake-id')).rejects.toThrow(NotFoundException);
    });

    it('deve falhar se usuário não for dono do plantio', async () => {
      const mockPlanting = {
        id: plantingId,
        plot: {
          farm: { userId: 'other-user' }
        }
      };

      mockPrisma.planting.findUnique.mockResolvedValue(mockPlanting);

      await expect(service.findOne(userId, plantingId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    const userId = 'user-123';
    const plantingId = 'planting-123';

    const mockPlanting = {
      id: plantingId,
      status: 'PLANNED',
      plot: {
        id: 'plot-123',
        farm: { userId }
      }
    };

    it('deve atualizar status com sucesso', async () => {
      const input = { status: PlantingStatus.IN_PROGRESS };

      mockPrisma.planting.findUnique.mockResolvedValue(mockPlanting);
      mockPrisma.planting.update.mockResolvedValue({
        ...mockPlanting,
        status: 'IN_PROGRESS',
        plot: { id: 'plot-123', name: 'Talhão', area: 50 },
        harvests: []
      });

      const result = await service.update(userId, plantingId, input);

      expect(mockPrisma.planting.update).toHaveBeenCalledWith({
        where: { id: plantingId },
        data: { status: 'IN_PROGRESS' },
        include: expect.any(Object)
      });
    });

    it('deve falhar em transição de status inválida', async () => {
      const input = { status: PlantingStatus.PLANNED };

      mockPrisma.planting.findUnique.mockResolvedValue({
        ...mockPlanting,
        status: 'HARVESTED'
      });

      await expect(service.update(userId, plantingId, input)).rejects.toThrow(BadRequestException);
      await expect(service.update(userId, plantingId, input)).rejects.toThrow(/Transição de status inválida/);
    });

    it('deve exigir actualHarvest ao marcar como HARVESTED', async () => {
      const input = { status: PlantingStatus.HARVESTED };

      mockPrisma.planting.findUnique.mockResolvedValue({
        ...mockPlanting,
        status: 'IN_PROGRESS',
        actualHarvest: null
      });

      await expect(service.update(userId, plantingId, input)).rejects.toThrow(BadRequestException);
      await expect(service.update(userId, plantingId, input)).rejects.toThrow(/data de colheita/);
    });

    it('deve permitir atualizar actualYield', async () => {
      const input = { actualYield: 3200 };

      mockPrisma.planting.findUnique.mockResolvedValue(mockPlanting);
      mockPrisma.planting.update.mockResolvedValue({
        ...mockPlanting,
        actualYield: 3200,
        plot: { id: 'plot-123', name: 'Talhão', area: 50 },
        harvests: []
      });

      await service.update(userId, plantingId, input);

      expect(mockPrisma.planting.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ actualYield: 3200 })
        })
      );
    });

    it('deve falhar se plantio não existir', async () => {
      mockPrisma.planting.findUnique.mockResolvedValue(null);

      await expect(service.update(userId, 'fake-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    const userId = 'user-123';
    const plantingId = 'planting-123';

    it('deve remover plantio sem colheitas', async () => {
      const mockPlanting = {
        id: plantingId,
        plot: {
          id: 'plot-123',
          name: 'Talhão',
          area: 50,
          farm: { userId }
        },
        harvests: []
      };

      mockPrisma.planting.findUnique.mockResolvedValue(mockPlanting);
      mockPrisma.planting.delete.mockResolvedValue(mockPlanting);

      await service.remove(userId, plantingId);

      expect(mockPrisma.planting.delete).toHaveBeenCalledWith({ where: { id: plantingId } });
      expect(mockLogger.logDatabase).toHaveBeenCalledWith('DELETE', 'Planting', { id: plantingId });
    });

    it('deve falhar se houver colheitas registradas', async () => {
      const mockPlanting = {
        id: plantingId,
        plot: {
          farm: { userId }
        },
        harvests: [{ id: 'harvest-1' }]
      };

      mockPrisma.planting.findUnique.mockResolvedValue(mockPlanting);

      await expect(service.remove(userId, plantingId)).rejects.toThrow(BadRequestException);
      await expect(service.remove(userId, plantingId)).rejects.toThrow(/possui colheitas registradas/);
    });

    it('deve falhar se plantio não existir', async () => {
      mockPrisma.planting.findUnique.mockResolvedValue(null);

      await expect(service.remove(userId, 'fake-id')).rejects.toThrow(NotFoundException);
    });

    it('deve falhar se usuário não for dono do plantio', async () => {
      const mockPlanting = {
        id: plantingId,
        plot: {
          farm: { userId: 'other-user' }
        },
        harvests: []
      };

      mockPrisma.planting.findUnique.mockResolvedValue(mockPlanting);

      await expect(service.remove(userId, plantingId)).rejects.toThrow(ForbiddenException);
    });
  });
});
