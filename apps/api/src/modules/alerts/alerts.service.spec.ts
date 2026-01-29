import { Test, TestingModule } from '@nestjs/testing';
import { AlertsService } from './alerts.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { AlertType, AlertSeverity } from './dto/create-alert.input';
import { AlertStatus } from './dto/update-alert.input';

describe('AlertsService', () => {
  let service: AlertsService;
  let prisma: PrismaService;

  const mockUserId = 'user-123';
  const mockAlertId = 'alert-123';

  const mockAlert = {
    id: mockAlertId,
    userId: mockUserId,
    type: 'WEATHER',
    severity: 'HIGH',
    status: 'PENDING',
    title: 'Alerta de Chuva Forte',
    message: 'Previsão de chuva forte para amanhã',
    metadata: null,
    expiresAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertsService,
        {
          provide: PrismaService,
          useValue: {
            alert: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              updateMany: jest.fn(),
              delete: jest.fn(),
              deleteMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createInput = {
      type: AlertType.WEATHER,
      severity: AlertSeverity.HIGH,
      title: 'Alerta de Chuva',
      message: 'Chuva forte prevista',
    };

    it('deve criar um alerta com sucesso', async () => {
      jest.spyOn(prisma.alert, 'create').mockResolvedValue(mockAlert as any);

      const result = await service.create(mockUserId, createInput);

      expect(result).toEqual(mockAlert);
      expect(prisma.alert.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: mockUserId,
          status: 'PENDING',
        }),
      });
    });

    it('deve criar alerta com metadata quando fornecido', async () => {
      const inputWithMetadata = {
        ...createInput,
        metadata: '{"temperature": 35}',
      };

      jest.spyOn(prisma.alert, 'create').mockResolvedValue({
        ...mockAlert,
        metadata: { temperature: 35 },
      } as any);

      await service.create(mockUserId, inputWithMetadata);

      expect(prisma.alert.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          metadata: { temperature: 35 },
        }),
      });
    });

    it('deve criar alerta com data de expiração', async () => {
      const inputWithExpiry = {
        ...createInput,
        expiresAt: '2026-02-01T00:00:00.000Z',
      };

      jest.spyOn(prisma.alert, 'create').mockResolvedValue({
        ...mockAlert,
        expiresAt: new Date('2026-02-01'),
      } as any);

      await service.create(mockUserId, inputWithExpiry);

      expect(prisma.alert.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          expiresAt: expect.any(Date),
        }),
      });
    });
  });

  describe('findAll', () => {
    it('deve listar todos os alertas do usuário', async () => {
      jest.spyOn(prisma.alert, 'findMany').mockResolvedValue([mockAlert] as any);

      const result = await service.findAll(mockUserId);

      expect(result).toEqual([mockAlert]);
      expect(prisma.alert.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        orderBy: [{ createdAt: 'desc' }],
      });
    });

    it('deve filtrar por tipo', async () => {
      jest.spyOn(prisma.alert, 'findMany').mockResolvedValue([mockAlert] as any);

      await service.findAll(mockUserId, AlertType.WEATHER);

      expect(prisma.alert.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId, type: AlertType.WEATHER },
        orderBy: [{ createdAt: 'desc' }],
      });
    });

    it('deve filtrar por status', async () => {
      jest.spyOn(prisma.alert, 'findMany').mockResolvedValue([mockAlert] as any);

      await service.findAll(mockUserId, undefined, AlertStatus.PENDING);

      expect(prisma.alert.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId, status: AlertStatus.PENDING },
        orderBy: [{ createdAt: 'desc' }],
      });
    });

    it('deve filtrar apenas alertas ativos (não expirados)', async () => {
      jest.spyOn(prisma.alert, 'findMany').mockResolvedValue([mockAlert] as any);

      await service.findAll(mockUserId, undefined, undefined, true);

      expect(prisma.alert.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          OR: [
            { expiresAt: null },
            { expiresAt: { gte: expect.any(Date) } },
          ],
        },
        orderBy: [{ createdAt: 'desc' }],
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um alerta específico', async () => {
      jest.spyOn(prisma.alert, 'findFirst').mockResolvedValue(mockAlert as any);

      const result = await service.findOne(mockAlertId, mockUserId);

      expect(result).toEqual(mockAlert);
    });

    it('deve falhar se o alerta não existir', async () => {
      jest.spyOn(prisma.alert, 'findFirst').mockResolvedValue(null);

      await expect(service.findOne(mockAlertId, mockUserId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar um alerta com sucesso', async () => {
      jest.spyOn(prisma.alert, 'findFirst').mockResolvedValue(mockAlert as any);
      jest.spyOn(prisma.alert, 'update').mockResolvedValue({
        ...mockAlert,
        status: 'READ',
      } as any);

      const result = await service.update(mockAlertId, mockUserId, { status: AlertStatus.READ });

      expect(result.status).toBe('READ');
    });

    it('deve falhar se o alerta não existir', async () => {
      jest.spyOn(prisma.alert, 'findFirst').mockResolvedValue(null);

      await expect(
        service.update(mockAlertId, mockUserId, { status: AlertStatus.READ }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deve remover um alerta com sucesso', async () => {
      jest.spyOn(prisma.alert, 'findFirst').mockResolvedValue(mockAlert as any);
      jest.spyOn(prisma.alert, 'delete').mockResolvedValue(mockAlert as any);

      const result = await service.remove(mockAlertId, mockUserId);

      expect(result).toEqual(mockAlert);
    });

    it('deve falhar se o alerta não existir', async () => {
      jest.spyOn(prisma.alert, 'findFirst').mockResolvedValue(null);

      await expect(service.remove(mockAlertId, mockUserId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('markAsRead', () => {
    it('deve marcar alerta como lido', async () => {
      jest.spyOn(prisma.alert, 'findFirst').mockResolvedValue(mockAlert as any);
      jest.spyOn(prisma.alert, 'update').mockResolvedValue({
        ...mockAlert,
        status: 'READ',
      } as any);

      const result = await service.markAsRead(mockAlertId, mockUserId);

      expect(result.status).toBe('READ');
    });
  });

  describe('markAsResolved', () => {
    it('deve marcar alerta como resolvido', async () => {
      jest.spyOn(prisma.alert, 'findFirst').mockResolvedValue(mockAlert as any);
      jest.spyOn(prisma.alert, 'update').mockResolvedValue({
        ...mockAlert,
        status: 'RESOLVED',
      } as any);

      const result = await service.markAsResolved(mockAlertId, mockUserId);

      expect(result.status).toBe('RESOLVED');
    });
  });

  describe('markAsDismissed', () => {
    it('deve marcar alerta como descartado', async () => {
      jest.spyOn(prisma.alert, 'findFirst').mockResolvedValue(mockAlert as any);
      jest.spyOn(prisma.alert, 'update').mockResolvedValue({
        ...mockAlert,
        status: 'DISMISSED',
      } as any);

      const result = await service.markAsDismissed(mockAlertId, mockUserId);

      expect(result.status).toBe('DISMISSED');
    });
  });

  describe('markAllAsRead', () => {
    it('deve marcar todos alertas pendentes como lidos', async () => {
      jest.spyOn(prisma.alert, 'updateMany').mockResolvedValue({ count: 5 } as any);

      const result = await service.markAllAsRead(mockUserId);

      expect(result.count).toBe(5);
      expect(prisma.alert.updateMany).toHaveBeenCalledWith({
        where: { userId: mockUserId, status: 'PENDING' },
        data: { status: 'READ' },
      });
    });
  });

  describe('countUnread', () => {
    it('deve contar alertas não lidos', async () => {
      jest.spyOn(prisma.alert, 'count').mockResolvedValue(3);

      const result = await service.countUnread(mockUserId);

      expect(result).toBe(3);
    });
  });

  describe('removeExpired', () => {
    it('deve remover alertas expirados', async () => {
      jest.spyOn(prisma.alert, 'deleteMany').mockResolvedValue({ count: 2 } as any);

      const result = await service.removeExpired(mockUserId);

      expect(result.count).toBe(2);
      expect(prisma.alert.deleteMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          expiresAt: { lt: expect.any(Date) },
        },
      });
    });
  });
});
