import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LoggerService } from '../../common/logger/logger.service';
import { CreatePlotInput } from './dto/create-plot.input';
import { UpdatePlotInput } from './dto/update-plot.input';

/**
 * Service responsável pela lógica de negócio de Talhões (Plots).
 * 
 * Gerencia operações CRUD de talhões, validações de ownership,
 * e garante integridade dos dados relacionados à fazenda.
 * 
 * @class PlotsService
 * @see {@link Plot} Para a entidade GraphQL
 * @see {@link CreatePlotInput} Para DTO de criação
 * 
 * @example
 * ```typescript
 * constructor(private plotsService: PlotsService) {}
 * 
 * async createPlot() {
 *   const plot = await this.plotsService.create(userId, {
 *     name: 'Talhão Norte',
 *     farmId: 'farm-uuid',
 *     area: 50.5,
 *     soilType: 'Argiloso'
 *   });
 * }
 * ```
 */
@Injectable()
export class PlotsService {
  private logger = new LoggerService(null as any);

  constructor(private prisma: PrismaService) {
    this.logger.setContext('PlotsService');
  }

  /**
   * Cria um novo talhão.
   * 
   * Valida que:
   * - Fazenda existe e pertence ao usuário
   * - Área do talhão não excede área disponível da fazenda
   * - Nome do talhão é único dentro da fazenda
   * 
   * @param userId - ID do usuário proprietário
   * @param createPlotInput - Dados do talhão a criar
   * @returns Promise com o talhão criado
   * @throws {NotFoundException} Se fazenda não existe ou não pertence ao usuário
   * @throws {BadRequestException} Se área excede disponível ou nome duplicado
   * 
   * @example
   * ```typescript
   * const plot = await service.create('user-123', {
   *   name: 'Talhão A',
   *   farmId: 'farm-456',
   *   area: 25.5
   * });
   * ```
   */
  async create(userId: string, createPlotInput: CreatePlotInput) {
    this.logger.log(`Creating plot: ${createPlotInput.name} for user: ${userId}`);

    // Verificar se fazenda existe e pertence ao usuário
    const farm = await this.prisma.farm.findFirst({
      where: {
        id: createPlotInput.farmId,
        userId,
      },
      include: {
        plots: true,
      },
    });

    if (!farm) {
      this.logger.warn(`Farm not found: ${createPlotInput.farmId} for user: ${userId}`);
      throw new NotFoundException('Fazenda não encontrada ou você não tem acesso');
    }

    // Verificar se já existe talhão com mesmo nome na fazenda
    const existingPlot = farm.plots.find(
      (plot) => plot.name.toLowerCase() === createPlotInput.name.toLowerCase(),
    );

    if (existingPlot) {
      this.logger.warn(`Duplicate plot name: ${createPlotInput.name} in farm: ${farm.id}`);
      throw new BadRequestException('Já existe um talhão com este nome nesta fazenda');
    }

    // Verificar se área total dos talhões não excede área da fazenda
    const usedArea = farm.plots.reduce((sum, plot) => sum + Number(plot.area), 0);
    const newTotalArea = usedArea + Number(createPlotInput.area);

    if (newTotalArea > Number(farm.totalArea)) {
      this.logger.warn(
        `Area exceeds farm total: ${newTotalArea} > ${farm.totalArea} for farm: ${farm.id}`,
      );
      throw new BadRequestException(
        `Área total dos talhões (${newTotalArea}ha) excede área da fazenda (${farm.totalArea}ha)`,
      );
    }

    // Criar talhão
    const plot = await this.prisma.plot.create({
      data: createPlotInput,
      include: {
        farm: true,
        plantings: true,
      },
    });

    this.logger.log(`Plot created successfully: ${plot.id}`);
    this.logger.logDatabase('create', 'Plot', { id: plot.id, name: plot.name });

    return plot;
  }

  /**
   * Busca todos os talhões do usuário.
   * 
   * Pode filtrar por fazenda específica usando o parâmetro farmId.
   * 
   * @param userId - ID do usuário
   * @param farmId - (Opcional) ID da fazenda para filtrar
   * @returns Promise com array de talhões
   * 
   * @example
   * ```typescript
   * // Todos os talhões do usuário
   * const allPlots = await service.findAll('user-123');
   * 
   * // Apenas talhões de uma fazenda
   * const farmPlots = await service.findAll('user-123', 'farm-456');
   * ```
   */
  async findAll(userId: string, farmId?: string) {
    this.logger.debug(`Finding plots for user: ${userId}, farmId: ${farmId || 'all'}`);

    const where: any = {
      farm: { userId },
    };

    if (farmId) {
      where.farmId = farmId;
    }

    const plots = await this.prisma.plot.findMany({
      where,
      include: {
        farm: true,
        plantings: {
          orderBy: {
            plantingDate: 'desc',
          },
          take: 5, // Apenas últimos 5 plantios por performance
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    this.logger.debug(`Found ${plots.length} plots`);
    return plots;
  }

  /**
   * Busca um talhão específico por ID.
   * 
   * Valida que o talhão pertence ao usuário (via fazenda).
   * 
   * @param id - ID do talhão
   * @param userId - ID do usuário
   * @returns Promise com o talhão encontrado
   * @throws {NotFoundException} Se talhão não existe ou não pertence ao usuário
   */
  async findOne(id: string, userId: string) {
    this.logger.debug(`Finding plot: ${id} for user: ${userId}`);

    const plot = await this.prisma.plot.findFirst({
      where: {
        id,
        farm: { userId },
      },
      include: {
        farm: true,
        plantings: {
          include: {
            harvests: true,
          },
          orderBy: {
            plantingDate: 'desc',
          },
        },
      },
    });

    if (!plot) {
      this.logger.warn(`Plot not found: ${id} for user: ${userId}`);
      throw new NotFoundException('Talhão não encontrado');
    }

    return plot;
  }

  /**
   * Atualiza um talhão existente.
   * 
   * Valida ownership e área disponível se área for alterada.
   * 
   * @param id - ID do talhão
   * @param userId - ID do usuário
   * @param updatePlotInput - Dados a atualizar
   * @returns Promise com o talhão atualizado
   * @throws {NotFoundException} Se talhão não existe
   * @throws {BadRequestException} Se nova área excede disponível
   */
  async update(id: string, userId: string, updatePlotInput: UpdatePlotInput) {
    this.logger.log(`Updating plot: ${id}`);

    // Verificar se talhão existe e pertence ao usuário
    const plot = await this.findOne(id, userId);

    // Se está atualizando área, validar
    if (updatePlotInput.area && updatePlotInput.area !== plot.area) {
      const farm = await this.prisma.farm.findUnique({
        where: { id: plot.farmId },
        include: { plots: true },
      });

      const usedArea = farm.plots
        .filter((p) => p.id !== id) // Excluir talhão atual
        .reduce((sum, p) => sum + Number(p.area), 0);
      
      const newTotalArea = usedArea + Number(updatePlotInput.area);

      if (newTotalArea > Number(farm.totalArea)) {
        throw new BadRequestException(
          `Nova área total dos talhões (${newTotalArea}ha) excede área da fazenda (${farm.totalArea}ha)`,
        );
      }
    }

    // Atualizar
    const updated = await this.prisma.plot.update({
      where: { id: plot.id },
      data: updatePlotInput,
      include: {
        farm: true,
        plantings: true,
      },
    });

    this.logger.log(`Plot updated successfully: ${id}`);
    this.logger.logDatabase('update', 'Plot', { id, changes: updatePlotInput });

    return updated;
  }

  /**
   * Remove um talhão.
   * 
   * ATENÇÃO: Remove em cascata todos os plantios e colheitas associados.
   * 
   * @param id - ID do talhão
   * @param userId - ID do usuário
   * @returns Promise<boolean> true se removido com sucesso
   * @throws {NotFoundException} Se talhão não existe
   * @throws {BadRequestException} Se talhão tem plantios ativos
   */
  async remove(id: string, userId: string) {
    this.logger.log(`Removing plot: ${id}`);

    // Verificar se talhão existe
    const plot = await this.findOne(id, userId);

    // Verificar se há plantios ativos
    const activePlantings = await this.prisma.planting.count({
      where: {
        plotId: id,
        status: {
          in: ['PLANNED', 'IN_PROGRESS'],
        },
      },
    });

    if (activePlantings > 0) {
      this.logger.warn(`Cannot delete plot with active plantings: ${id}`);
      throw new BadRequestException(
        `Não é possível remover talhão com ${activePlantings} plantio(s) ativo(s)`,
      );
    }

    // Remover
    await this.prisma.plot.delete({
      where: { id: plot.id },
    });

    this.logger.log(`Plot removed successfully: ${id}`);
    this.logger.logDatabase('delete', 'Plot', { id });

    return true;
  }
}
