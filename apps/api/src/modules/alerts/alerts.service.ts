import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAlertInput } from './dto/create-alert.input';
import { UpdateAlertInput } from './dto/update-alert.input';
import { AlertType } from './dto/create-alert.input';
import { AlertStatus } from './dto/update-alert.input';
import { AlertsGateway } from '../../websockets/alerts.gateway';

@Injectable()
export class AlertsService {
  constructor(
    private prisma: PrismaService,
    private alertsGateway: AlertsGateway,
  ) {}

  async create(userId: string, createAlertInput: CreateAlertInput) {
    const data: any = {
      ...createAlertInput,
      userId,
      status: 'PENDING',
    };

    if (createAlertInput.metadata) {
      data.metadata = JSON.parse(createAlertInput.metadata);
    }

    if (createAlertInput.expiresAt) {
      data.expiresAt = new Date(createAlertInput.expiresAt);
    }

    const alert = await this.prisma.alert.create({
      data,
    });

    // Emit WebSocket event for new alert
    try {
      if (createAlertInput.type === 'WEATHER') {
        this.alertsGateway.sendWeatherAlert(userId, alert);
      } else if (createAlertInput.type === 'MARKET') {
        this.alertsGateway.sendMarketAlert(userId, alert);
      } else {
        this.alertsGateway.sendAlertToUser(userId, alert);
      }
    } catch (error) {
      // Log error but don't fail the request
      console.error('Failed to send WebSocket alert:', error);
    }

    return alert;
  }

  async findAll(
    userId: string,
    type?: AlertType,
    status?: AlertStatus,
    onlyActive?: boolean,
  ) {
    const where: any = { userId };

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (onlyActive) {
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } },
      ];
    }

    return this.prisma.alert.findMany({
      where,
      orderBy: [
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(id: string, userId: string) {
    const alert = await this.prisma.alert.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!alert) {
      throw new NotFoundException('Alerta não encontrado');
    }

    return alert;
  }

  async update(id: string, userId: string, updateAlertInput: UpdateAlertInput) {
    // Verificar se o alerta existe e pertence ao usuário
    await this.findOne(id, userId);

    return this.prisma.alert.update({
      where: { id },
      data: updateAlertInput,
    });
  }

  async remove(id: string, userId: string) {
    // Verificar se o alerta existe e pertence ao usuário
    await this.findOne(id, userId);

    return this.prisma.alert.delete({
      where: { id },
    });
  }

  /**
   * Marca um alerta como lido
   */
  async markAsRead(id: string, userId: string) {
    return this.update(id, userId, { status: AlertStatus.READ });
  }

  /**
   * Marca um alerta como resolvido
   */
  async markAsResolved(id: string, userId: string) {
    return this.update(id, userId, { status: AlertStatus.RESOLVED });
  }

  /**
   * Marca um alerta como descartado
   */
  async markAsDismissed(id: string, userId: string) {
    return this.update(id, userId, { status: AlertStatus.DISMISSED });
  }

  /**
   * Marca todos alertas pendentes como lidos
   */
  async markAllAsRead(userId: string) {
    return this.prisma.alert.updateMany({
      where: {
        userId,
        status: 'PENDING',
      },
      data: {
        status: 'READ',
      },
    });
  }

  /**
   * Conta alertas não lidos
   */
  async countUnread(userId: string) {
    return this.prisma.alert.count({
      where: {
        userId,
        status: 'PENDING',
      },
    });
  }

  /**
   * Remove alertas expirados
   */
  async removeExpired(userId: string) {
    return this.prisma.alert.deleteMany({
      where: {
        userId,
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
