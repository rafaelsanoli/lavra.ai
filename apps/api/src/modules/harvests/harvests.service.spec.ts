import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { HarvestsService } from './harvests.service';
import { PrismaService } from '../../prisma/prisma.service';
import { LoggerService } from '../../common/logger/logger.service';

describe('HarvestsService', () => {
  let service: HarvestsService;
  let prisma: PrismaService;
  let logger: LoggerService;

  const mockPrisma = {
    harvest: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    planting: {
      findUnique: jest.fn(),
      update: jest.fn()
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
        HarvestsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: LoggerService, useValue: mockLogger }
      ]
    }).compile();

    service = module.get<HarvestsService>(HarvestsService);
    prisma = module.get<PrismaService>(PrismaService);
    logger = module.get<LoggerService>(LoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const userId = 'user-123';
    const input = {
      plantingId: 'planting-123',
      harvestDate: '2026-02-15T00:00:00.000Z',
      quantity: 30000, // 30 toneladas
      quality: 'A',
      price: 120, // R$/saca (60kg)
      notes: 'Colheita excelente'
    };

    const mockPlanting = {
      id: 'planting-123',
      area: 10, // 10 hectares
      status: 'HARVESTED',
      actualYield: null,
      plot: {
        id: 'plot-123',
        farm: {
          id: 'farm-123',
          userId: 'user-123'
        }
      }
    };

    it('deve criar uma colheita com sucesso e calcular produtividade', async () => {
      const mockHarvest = {
        id: 'harvest-123',
        ...input,
        harvestDate: new Date(input.harvestDate),
        planting: {
          id: mockPlanting.id,
          cropType: 'Soja',
          area: mockPlanting.area
        }
      };

      mockPrisma.planting.findUnique.mockResolvedValue(mockPlanting);
      mockPrisma.harvest.create.mockResolvedValue(mockHarvest);
      mockPrisma.planting.update.mockResolvedValue({});

      const result = await service.create(userId, input);

      // Produtividade = 30000 kg / 10 ha = 3000 kg/ha
      expect(result.productivity).toBe(3000);
      // Valor total = 30000 kg * 120 = 3,600,000
      expect(result.totalValue).toBe(3600000);
      expect(mockPrisma.planting.update).toHaveBeenCalledWith({
        where: { id: input.plantingId },
        data: {
          actualYield: 3000,
          actualHarvest: expect.any(Date)
        }
      });
    });

    it('deve falhar se o plantio não existir', async () => {
      mockPrisma.planting.findUnique.mockResolvedValue(null);

      await expect(service.create(userId, input)).rejects.toThrow(NotFoundException);
      await expect(service.create(userId, input)).rejects.toThrow('Plantio não encontrado');
    });

    it('deve falhar se o usuário não for dono do plantio', async () => {
      const plantingWithDifferentUser = {
        ...mockPlanting,
        plot: {
          ...mockPlanting.plot,
          farm: { ...mockPlanting.plot.farm, userId: 'other-user' }
        }
      };

      mockPrisma.planting.findUnique.mockResolvedValue(plantingWithDifferentUser);

      await expect(service.create(userId, input)).rejects.toThrow(ForbiddenException);
    });

    it('deve falhar se plantio não estiver com status HARVESTED', async () => {
      const plantingInProgress = {
        ...mockPlanting,
        status: 'IN_PROGRESS'
      };

      mockPrisma.planting.findUnique.mockResolvedValue(plantingInProgress);

      await expect(service.create(userId, input)).rejects.toThrow(BadRequestException);
      await expect(service.create(userId, input)).rejects.toThrow(/status HARVESTED/);
    });

    it('deve calcular corretamente quando não há preço', async () => {
      const inputWithoutPrice = { ...input, price: undefined };
      const mockHarvest = {
        id: 'harvest-123',
        ...inputWithoutPrice,
        harvestDate: new Date(input.harvestDate),
        price: null,
        planting: {
          id: mockPlanting.id,
          cropType: 'Soja',
          area: mockPlanting.area
        }
      };

      mockPrisma.planting.findUnique.mockResolvedValue(mockPlanting);
      mockPrisma.harvest.create.mockResolvedValue(mockHarvest);
      mockPrisma.planting.update.mockResolvedValue({});

      const result = await service.create(userId, inputWithoutPrice);

      expect(result.productivity).toBe(3000);
      expect(result.totalValue).toBeNull();
    });

    it('não deve atualizar actualYield se já existir', async () => {
      const plantingWithYield = {
        ...mockPlanting,
        actualYield: 2800
      };

      const mockHarvest = {
        id: 'harvest-123',
        ...input,
        harvestDate: new Date(input.harvestDate),
        planting: {
          id: mockPlanting.id,
          cropType: 'Soja',
          area: mockPlanting.area
        }
      };

      mockPrisma.planting.findUnique.mockResolvedValue(plantingWithYield);
      mockPrisma.harvest.create.mockResolvedValue(mockHarvest);

      await service.create(userId, input);

      expect(mockPrisma.planting.update).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    const userId = 'user-123';

    it('deve listar todas as colheitas do usuário', async () => {
      const mockHarvests = [
        {
          id: 'harvest-1',
          quantity: 30000,
          price: 120,
          planting: { id: 'planting-1', cropType: 'Soja', area: 10 }
        },
        {
          id: 'harvest-2',
          quantity: 15000,
          price: 100,
          planting: { id: 'planting-2', cropType: 'Milho', area: 5 }
        }
      ];

      mockPrisma.harvest.findMany.mockResolvedValue(mockHarvests);

      const result = await service.findAll(userId);

      expect(result).toHaveLength(2);
      expect(result[0].productivity).toBe(3000); // 30000/10
      expect(result[0].totalValue).toBe(3600000); // 30000*120
      expect(result[1].productivity).toBe(3000); // 15000/5
      expect(result[1].totalValue).toBe(1500000); // 15000*100
    });

    it('deve filtrar por plantingId quando fornecido', async () => {
      const plantingId = 'planting-123';
      mockPrisma.harvest.findMany.mockResolvedValue([]);

      await service.findAll(userId, plantingId);

      expect(mockPrisma.harvest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            plantingId
          })
        })
      );
    });
  });

  describe('findOne', () => {
    const userId = 'user-123';
    const harvestId = 'harvest-123';

    it('deve retornar uma colheita específica com cálculos', async () => {
      const mockHarvest = {
        id: harvestId,
        quantity: 30000,
        price: 120,
        planting: {
          id: 'planting-123',
          cropType: 'Soja',
          area: 10,
          plot: {
            farm: { userId }
          }
        }
      };

      mockPrisma.harvest.findUnique.mockResolvedValue(mockHarvest);

      const result = await service.findOne(userId, harvestId);

      expect(result.id).toBe(harvestId);
      expect(result.productivity).toBe(3000);
      expect(result.totalValue).toBe(3600000);
    });

    it('deve falhar se colheita não existir', async () => {
      mockPrisma.harvest.findUnique.mockResolvedValue(null);

      await expect(service.findOne(userId, 'fake-id')).rejects.toThrow(NotFoundException);
    });

    it('deve falhar se usuário não for dono da colheita', async () => {
      const mockHarvest = {
        id: harvestId,
        planting: {
          plot: {
            farm: { userId: 'other-user' }
          }
        }
      };

      mockPrisma.harvest.findUnique.mockResolvedValue(mockHarvest);

      await expect(service.findOne(userId, harvestId)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    const userId = 'user-123';
    const harvestId = 'harvest-123';

    it('deve atualizar colheita com sucesso e recalcular totalValue', async () => {
      const input = { price: 150, quality: 'A+' };
      
      const mockHarvest = {
        id: harvestId,
        quantity: 30000,
        price: 120,
        planting: {
          id: 'planting-123',
          area: 10,
          plot: {
            farm: { userId }
          }
        }
      };

      const mockUpdated = {
        ...mockHarvest,
        price: 150,
        quality: 'A+',
        planting: {
          id: 'planting-123',
          cropType: 'Soja',
          area: 10
        }
      };

      mockPrisma.harvest.findUnique.mockResolvedValue(mockHarvest);
      mockPrisma.harvest.update.mockResolvedValue(mockUpdated);

      const result = await service.update(userId, harvestId, input);

      expect(result.totalValue).toBe(4500000); // 30000 * 150
      expect(mockPrisma.harvest.update).toHaveBeenCalledWith({
        where: { id: harvestId },
        data: input,
        include: expect.any(Object)
      });
    });

    it('deve falhar se colheita não existir', async () => {
      mockPrisma.harvest.findUnique.mockResolvedValue(null);

      await expect(service.update(userId, 'fake-id', {})).rejects.toThrow(NotFoundException);
    });

    it('deve falhar se usuário não for dono da colheita', async () => {
      const mockHarvest = {
        id: harvestId,
        planting: {
          plot: {
            farm: { userId: 'other-user' }
          }
        }
      };

      mockPrisma.harvest.findUnique.mockResolvedValue(mockHarvest);

      await expect(service.update(userId, harvestId, {})).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    const userId = 'user-123';
    const harvestId = 'harvest-123';

    it('deve remover colheita com sucesso', async () => {
      const mockHarvest = {
        id: harvestId,
        quantity: 30000,
        price: 120,
        planting: {
          id: 'planting-123',
          cropType: 'Soja',
          area: 10,
          plot: {
            farm: { userId }
          }
        }
      };

      mockPrisma.harvest.findUnique.mockResolvedValue(mockHarvest);
      mockPrisma.harvest.delete.mockResolvedValue(mockHarvest);

      await service.remove(userId, harvestId);

      expect(mockPrisma.harvest.delete).toHaveBeenCalledWith({ where: { id: harvestId } });
      expect(mockLogger.logDatabase).toHaveBeenCalledWith('DELETE', 'Harvest', { id: harvestId });
    });

    it('deve falhar se colheita não existir', async () => {
      mockPrisma.harvest.findUnique.mockResolvedValue(null);

      await expect(service.remove(userId, 'fake-id')).rejects.toThrow(NotFoundException);
    });

    it('deve falhar se usuário não for dono da colheita', async () => {
      const mockHarvest = {
        id: harvestId,
        planting: {
          plot: {
            farm: { userId: 'other-user' }
          }
        }
      };

      mockPrisma.harvest.findUnique.mockResolvedValue(mockHarvest);

      await expect(service.remove(userId, harvestId)).rejects.toThrow(ForbiddenException);
    });
  });
});
