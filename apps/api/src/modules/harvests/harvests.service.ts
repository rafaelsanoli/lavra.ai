import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LoggerService } from '../../common/logger/logger.service';
import { CreateHarvestInput } from './dto/create-harvest.input';
import { UpdateHarvestInput } from './dto/update-harvest.input';
import { Harvest } from './entities/harvest.entity';

@Injectable()
export class HarvestsService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService
  ) {}

  /**
   * Cria um novo registro de colheita e calcula automaticamente produtividade e valor total.
   * Também atualiza o plantio com o yield real.
   * 
   * Validações realizadas:
   * - Verifica se o plantio existe e pertence ao usuário
   * - Valida se o plantio está com status HARVESTED
   * - Calcula produtividade (kg/ha) baseada na área do plantio
   * - Calcula valor total (quantidade * preço)
   * - Atualiza plantio com actualYield se for a primeira colheita
   * 
   * @param userId - ID do usuário autenticado
   * @param input - Dados da colheita a ser criada
   * @returns A colheita criada com os cálculos
   * @throws {NotFoundException} Se o plantio não for encontrado
   * @throws {ForbiddenException} Se o usuário não for dono do plantio
   * @throws {BadRequestException} Se o plantio não estiver finalizado
   */
  async create(userId: string, input: CreateHarvestInput): Promise<Harvest> {
    this.logger.log(`Criando colheita para usuário ${userId}`, 'HarvestsService');

    // 1. Validar ownership do plantio
    const planting = await this.prisma.planting.findUnique({
      where: { id: input.plantingId },
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
      throw new ForbiddenException('Você não tem permissão para registrar colheitas neste plantio');
    }

    // 2. Validar se plantio está finalizado (status HARVESTED)
    if (planting.status !== 'HARVESTED') {
      throw new BadRequestException(
        `Não é possível registrar colheita. O plantio deve estar com status HARVESTED. Status atual: ${planting.status}`
      );
    }

    // 3. Calcular produtividade (kg/ha)
    const productivity = input.quantity / planting.area;

    // 4. Calcular valor total se preço foi informado
    const totalValue = input.price ? input.quantity * input.price : null;

    // 5. Criar colheita
    const harvestDate = new Date(input.harvestDate);
    
    const harvest = await this.prisma.harvest.create({
      data: {
        plantingId: input.plantingId,
        harvestDate,
        quantity: input.quantity,
        quality: input.quality,
        price: input.price,
        notes: input.notes
      },
      include: {
        planting: {
          select: {
            id: true,
            cropType: true,
            area: true
          }
        }
      }
    });

    // 6. Atualizar plantio com actualYield se for a primeira colheita
    if (!planting.actualYield) {
      await this.prisma.planting.update({
        where: { id: input.plantingId },
        data: {
          actualYield: productivity,
          actualHarvest: harvestDate
        }
      });
    }

    this.logger.logDatabase('CREATE', 'Harvest', { 
      id: harvest.id, 
      quantity: input.quantity,
      productivity 
    });

    return {
      ...harvest,
      productivity,
      totalValue
    } as any;
  }

  /**
   * Lista todas as colheitas do usuário com filtros opcionais
   * 
   * @param userId - ID do usuário autenticado
   * @param plantingId - (Opcional) Filtrar por plantio específico
   * @returns Lista de colheitas com cálculos
   */
  async findAll(userId: string, plantingId?: string): Promise<Harvest[]> {
    this.logger.log(`Listando colheitas para usuário ${userId}`, 'HarvestsService');

    const where: any = {
      planting: {
        plot: {
          farm: { userId }
        }
      }
    };

    if (plantingId) {
      where.plantingId = plantingId;
    }

    const harvests = await this.prisma.harvest.findMany({
      where,
      include: {
        planting: {
          select: {
            id: true,
            cropType: true,
            area: true
          }
        }
      },
      orderBy: { harvestDate: 'desc' }
    });

    // Calcular produtividade e valor total para cada colheita
    return harvests.map(harvest => ({
      ...harvest,
      productivity: harvest.quantity / harvest.planting.area,
      totalValue: harvest.price ? harvest.quantity * harvest.price : null
    })) as any;
  }

  /**
   * Busca uma colheita específica por ID
   * 
   * @param userId - ID do usuário autenticado
   * @param id - ID da colheita
   * @returns A colheita encontrada com cálculos
   * @throws {NotFoundException} Se a colheita não for encontrada
   * @throws {ForbiddenException} Se o usuário não for dono da colheita
   */
  async findOne(userId: string, id: string): Promise<Harvest> {
    const harvest = await this.prisma.harvest.findUnique({
      where: { id },
      include: {
        planting: {
          include: {
            plot: {
              include: { farm: true }
            }
          }
        }
      }
    });

    if (!harvest) {
      throw new NotFoundException('Colheita não encontrada');
    }

    if (harvest.planting.plot.farm.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para acessar esta colheita');
    }

    return {
      ...harvest,
      planting: {
        id: harvest.planting.id,
        cropType: harvest.planting.cropType,
        area: harvest.planting.area
      },
      productivity: harvest.quantity / harvest.planting.area,
      totalValue: harvest.price ? harvest.quantity * harvest.price : null
    } as any;
  }

  /**
   * Atualiza uma colheita existente.
   * Recalcula totalValue se o preço for alterado.
   * 
   * @param userId - ID do usuário autenticado
   * @param id - ID da colheita a ser atualizada
   * @param input - Dados a serem atualizados
   * @returns A colheita atualizada com cálculos
   * @throws {NotFoundException} Se a colheita não for encontrada
   * @throws {ForbiddenException} Se o usuário não for dono da colheita
   */
  async update(userId: string, id: string, input: UpdateHarvestInput): Promise<Harvest> {
    this.logger.log(`Atualizando colheita ${id}`, 'HarvestsService');

    // 1. Buscar colheita e validar ownership
    const harvest = await this.prisma.harvest.findUnique({
      where: { id },
      include: {
        planting: {
          include: {
            plot: {
              include: { farm: true }
            }
          }
        }
      }
    });

    if (!harvest) {
      throw new NotFoundException('Colheita não encontrada');
    }

    if (harvest.planting.plot.farm.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para atualizar esta colheita');
    }

    // 2. Atualizar colheita
    const updated = await this.prisma.harvest.update({
      where: { id },
      data: input,
      include: {
        planting: {
          select: {
            id: true,
            cropType: true,
            area: true
          }
        }
      }
    });

    this.logger.logDatabase('UPDATE', 'Harvest', { id, changes: input });

    // 3. Recalcular valores
    const newPrice = input.price !== undefined ? input.price : updated.price;
    
    return {
      ...updated,
      productivity: updated.quantity / updated.planting.area,
      totalValue: newPrice ? updated.quantity * newPrice : null
    } as any;
  }

  /**
   * Remove uma colheita.
   * 
   * @param userId - ID do usuário autenticado
   * @param id - ID da colheita a ser removida
   * @returns A colheita removida
   * @throws {NotFoundException} Se a colheita não for encontrada
   * @throws {ForbiddenException} Se o usuário não for dono da colheita
   */
  async remove(userId: string, id: string): Promise<Harvest> {
    this.logger.log(`Removendo colheita ${id}`, 'HarvestsService');

    // 1. Buscar colheita e validar ownership
    const harvest = await this.prisma.harvest.findUnique({
      where: { id },
      include: {
        planting: {
          include: {
            plot: {
              include: { farm: true }
            }
          }
        }
      }
    });

    if (!harvest) {
      throw new NotFoundException('Colheita não encontrada');
    }

    if (harvest.planting.plot.farm.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para remover esta colheita');
    }

    // 2. Remover colheita
    await this.prisma.harvest.delete({ where: { id } });

    this.logger.logDatabase('DELETE', 'Harvest', { id });

    return {
      ...harvest,
      planting: {
        id: harvest.planting.id,
        cropType: harvest.planting.cropType,
        area: harvest.planting.area
      },
      productivity: harvest.quantity / harvest.planting.area,
      totalValue: harvest.price ? harvest.quantity * harvest.price : null
    } as any;
  }
}
