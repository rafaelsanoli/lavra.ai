import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LoggerService } from '../../common/logger/logger.service';
import { CreatePlantingInput } from './dto/create-planting.input';
import { UpdatePlantingInput, PlantingStatus } from './dto/update-planting.input';
import { Planting } from './entities/planting.entity';

@Injectable()
export class PlantingsService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService
  ) {}

  /**
   * Cria um novo plantio no talhão especificado.
   * 
   * Validações realizadas:
   * - Verifica se o talhão existe e pertence ao usuário
   * - Valida se a data de plantio é anterior à data esperada de colheita
   * - Garante que a área plantada não excede a área disponível no talhão
   * 
   * @param userId - ID do usuário autenticado
   * @param input - Dados do plantio a ser criado
   * @returns O plantio criado com as relações carregadas
   * @throws {NotFoundException} Se o talhão não for encontrado
   * @throws {ForbiddenException} Se o usuário não for dono do talhão
   * @throws {BadRequestException} Se as datas forem inválidas ou área exceder limite
   */
  async create(userId: string, input: CreatePlantingInput): Promise<Planting> {
    this.logger.log(`Criando plantio para usuário ${userId}`, 'PlantingsService');

    // 1. Validar ownership do talhão
    const plot = await this.prisma.plot.findUnique({
      where: { id: input.plotId },
      include: { farm: true }
    });

    if (!plot) {
      throw new NotFoundException('Talhão não encontrado');
    }

    if (plot.farm.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para criar plantios neste talhão');
    }

    // 2. Validar datas (plantingDate < expectedHarvest)
    const plantingDate = new Date(input.plantingDate);
    const expectedHarvest = new Date(input.expectedHarvest);

    if (plantingDate >= expectedHarvest) {
      throw new BadRequestException(
        'Data de plantio deve ser anterior à data esperada de colheita'
      );
    }

    // 3. Validar área disponível no talhão
    const activePlantings = await this.prisma.planting.aggregate({
      where: {
        plotId: input.plotId,
        status: { in: ['PLANNED', 'IN_PROGRESS'] }
      },
      _sum: { area: true }
    });

    const usedArea = activePlantings._sum.area || 0;
    const availableArea = plot.area - usedArea;

    if (input.area > availableArea) {
      throw new BadRequestException(
        `Área de plantio (${input.area} ha) excede área disponível no talhão (${availableArea} ha). ` +
        `Área total: ${plot.area} ha, área usada: ${usedArea} ha`
      );
    }

    // 4. Criar plantio
    const planting = await this.prisma.planting.create({
      data: {
        ...input,
        plantingDate,
        expectedHarvest
      },
      include: {
        plot: {
          select: {
            id: true,
            name: true,
            area: true
          }
        },
        harvests: {
          take: 5,
          orderBy: { harvestDate: 'desc' },
          select: {
            id: true,
            harvestDate: true,
            quantity: true,
            quality: true
          }
        }
      }
    });

    this.logger.logDatabase('CREATE', 'Planting', { id: planting.id, cropType: input.cropType });
    return planting as any;
  }

  /**
   * Lista todos os plantios do usuário com filtros opcionais
   * 
   * @param userId - ID do usuário autenticado
   * @param plotId - (Opcional) Filtrar por talhão específico
   * @param status - (Opcional) Filtrar por status
   * @returns Lista de plantios
   */
  async findAll(userId: string, plotId?: string, status?: PlantingStatus): Promise<Planting[]> {
    this.logger.log(`Listando plantios para usuário ${userId}`, 'PlantingsService');

    const where: any = {
      plot: {
        farm: { userId }
      }
    };

    if (plotId) {
      where.plotId = plotId;
    }

    if (status) {
      where.status = status;
    }

    const plantings = await this.prisma.planting.findMany({
      where,
      include: {
        plot: {
          select: {
            id: true,
            name: true,
            area: true
          }
        },
        harvests: {
          take: 5,
          orderBy: { harvestDate: 'desc' },
          select: {
            id: true,
            harvestDate: true,
            quantity: true,
            quality: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return plantings as any;
  }

  /**
   * Busca um plantio específico por ID
   * 
   * @param userId - ID do usuário autenticado
   * @param id - ID do plantio
   * @returns O plantio encontrado
   * @throws {NotFoundException} Se o plantio não for encontrado
   * @throws {ForbiddenException} Se o usuário não for dono do plantio
   */
  async findOne(userId: string, id: string): Promise<Planting> {
    const planting = await this.prisma.planting.findUnique({
      where: { id },
      include: {
        plot: {
          include: {
            farm: true
          }
        },
        harvests: {
          orderBy: { harvestDate: 'desc' },
          select: {
            id: true,
            harvestDate: true,
            quantity: true,
            quality: true
          }
        }
      }
    });

    if (!planting) {
      throw new NotFoundException('Plantio não encontrado');
    }

    if (planting.plot.farm.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para acessar este plantio');
    }

    return {
      ...planting,
      plot: {
        id: planting.plot.id,
        name: planting.plot.name,
        area: planting.plot.area
      }
    } as any;
  }

  /**
   * Atualiza um plantio existente.
   * 
   * Validações:
   * - Verifica ownership do plantio
   * - Valida transições de status permitidas
   * - Ao marcar como HARVESTED, exige actualHarvest
   * 
   * @param userId - ID do usuário autenticado
   * @param id - ID do plantio a ser atualizado
   * @param input - Dados a serem atualizados
   * @returns O plantio atualizado
   * @throws {NotFoundException} Se o plantio não for encontrado
   * @throws {ForbiddenException} Se o usuário não for dono do plantio
   * @throws {BadRequestException} Se a transição de status for inválida
   */
  async update(userId: string, id: string, input: UpdatePlantingInput): Promise<Planting> {
    this.logger.log(`Atualizando plantio ${id}`, 'PlantingsService');

    // 1. Buscar plantio e validar ownership
    const planting = await this.prisma.planting.findUnique({
      where: { id },
      include: {
        plot: {
          include: { farm: true }
        }
      }
    });

    if (!planting) {
      throw new NotFoundException('Plantio não encontrado');
    }

    if (planting.plot.farm.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para atualizar este plantio');
    }

    // 2. Validar transições de status
    if (input.status && input.status !== planting.status) {
      const allowedTransitions: Record<string, string[]> = {
        PLANNED: ['IN_PROGRESS', 'FAILED'],
        IN_PROGRESS: ['HARVESTED', 'FAILED'],
        HARVESTED: [],
        FAILED: []
      };

      if (!allowedTransitions[planting.status].includes(input.status)) {
        throw new BadRequestException(
          `Transição de status inválida: ${planting.status} → ${input.status}. ` +
          `Transições permitidas: ${allowedTransitions[planting.status].join(', ') || 'nenhuma'}`
        );
      }

      // Se marcar como HARVESTED, deve informar data de colheita
      if (input.status === 'HARVESTED' && !input.actualHarvest && !planting.actualHarvest) {
        throw new BadRequestException(
          'Ao marcar como HARVESTED, é necessário informar a data de colheita (actualHarvest)'
        );
      }
    }

    // 3. Preparar dados de atualização
    const updateData: any = {};

    if (input.status) updateData.status = input.status;
    if (input.actualHarvest) updateData.actualHarvest = new Date(input.actualHarvest);
    if (input.actualYield !== undefined) updateData.actualYield = input.actualYield;
    if (input.notes !== undefined) updateData.notes = input.notes;

    // 4. Atualizar plantio
    const updated = await this.prisma.planting.update({
      where: { id },
      data: updateData,
      include: {
        plot: {
          select: {
            id: true,
            name: true,
            area: true
          }
        },
        harvests: {
          take: 5,
          orderBy: { harvestDate: 'desc' },
          select: {
            id: true,
            harvestDate: true,
            quantity: true,
            quality: true
          }
        }
      }
    });

    this.logger.logDatabase('UPDATE', 'Planting', { id, changes: input });
    return updated as any;
  }

  /**
   * Remove um plantio.
   * 
   * Validações:
   * - Verifica ownership do plantio
   * - Não permite remover se houver colheitas registradas
   * 
   * @param userId - ID do usuário autenticado
   * @param id - ID do plantio a ser removido
   * @returns O plantio removido
   * @throws {NotFoundException} Se o plantio não for encontrado
   * @throws {ForbiddenException} Se o usuário não for dono do plantio
   * @throws {BadRequestException} Se houver colheitas vinculadas
   */
  async remove(userId: string, id: string): Promise<Planting> {
    this.logger.log(`Removendo plantio ${id}`, 'PlantingsService');

    // 1. Buscar plantio e validar ownership
    const planting = await this.prisma.planting.findUnique({
      where: { id },
      include: {
        plot: {
          include: { farm: true }
        },
        harvests: true
      }
    });

    if (!planting) {
      throw new NotFoundException('Plantio não encontrado');
    }

    if (planting.plot.farm.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para remover este plantio');
    }

    // 2. Validar se não há colheitas registradas
    if (planting.harvests && planting.harvests.length > 0) {
      throw new BadRequestException(
        'Não é possível remover um plantio que possui colheitas registradas. ' +
        'Remova as colheitas primeiro ou mantenha o registro histórico.'
      );
    }

    // 3. Remover plantio
    await this.prisma.planting.delete({ where: { id } });

    this.logger.logDatabase('DELETE', 'Planting', { id });
    
    return {
      ...planting,
      plot: {
        id: planting.plot.id,
        name: planting.plot.name,
        area: planting.plot.area
      },
      harvests: []
    } as any;
  }
}
