import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PlotsService } from './plots.service';
import { Plot } from './entities/plot.entity';
import { CreatePlotInput } from './dto/create-plot.input';
import { UpdatePlotInput } from './dto/update-plot.input';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

/**
 * Resolver GraphQL para operações de Talhões (Plots).
 * 
 * Todas as operações requerem autenticação (GqlAuthGuard).
 * O usuário só pode acessar/modificar talhões das suas próprias fazendas.
 * 
 * @class PlotsResolver
 * @see {@link PlotsService} Para lógica de negócio
 * 
 * @example
 * ```graphql
 * # Criar talhão
 * mutation {
 *   createPlot(createPlotInput: {
 *     name: "Talhão Norte"
 *     farmId: "farm-uuid"
 *     area: 50.5
 *     soilType: "Argiloso"
 *   }) {
 *     id
 *     name
 *     area
 *   }
 * }
 * ```
 */
@Resolver(() => Plot)
@UseGuards(GqlAuthGuard)
export class PlotsResolver {
  constructor(private plotsService: PlotsService) {}

  /**
   * Mutation para criar novo talhão.
   * 
   * @param userId - ID do usuário autenticado (injetado via decorator)
   * @param createPlotInput - Dados do talhão
   * @returns Promise<Plot> Talhão criado
   * @throws {NotFoundException} Se fazenda não existe
   * @throws {BadRequestException} Se validações falharem
   * 
   * @example
   * ```graphql
   * mutation CreatePlot($input: CreatePlotInput!) {
   *   createPlot(createPlotInput: $input) {
   *     id
   *     name
   *     area
   *     farm {
   *       name
   *     }
   *   }
   * }
   * ```
   */
  @Mutation(() => Plot, {
    description: 'Cria um novo talhão em uma fazenda',
  })
  async createPlot(
    @CurrentUser('id') userId: string,
    @Args('createPlotInput') createPlotInput: CreatePlotInput,
  ): Promise<Plot> {
    return this.plotsService.create(userId, createPlotInput);
  }

  /**
   * Query para listar talhões do usuário.
   * 
   * Pode filtrar por fazenda específica passando farmId.
   * 
   * @param userId - ID do usuário autenticado
   * @param farmId - (Opcional) Filtrar por fazenda
   * @returns Promise<Plot[]> Lista de talhões
   * 
   * @example
   * ```graphql
   * # Todos os talhões
   * query {
   *   plots {
   *     id
   *     name
   *     area
   *     farm {
   *       name
   *     }
   *   }
   * }
   * 
   * # Talhões de uma fazenda
   * query {
   *   plots(farmId: "farm-uuid") {
   *     id
   *     name
   *   }
   * }
   * ```
   */
  @Query(() => [Plot], {
    name: 'plots',
    description: 'Lista todos os talhões do usuário, opcionalmente filtrados por fazenda',
  })
  async findAll(
    @CurrentUser('id') userId: string,
    @Args('farmId', { nullable: true, description: 'ID da fazenda para filtrar' })
    farmId?: string,
  ): Promise<Plot[]> {
    return this.plotsService.findAll(userId, farmId);
  }

  /**
   * Query para buscar talhão específico por ID.
   * 
   * @param id - ID do talhão
   * @param userId - ID do usuário autenticado
   * @returns Promise<Plot> Talhão encontrado
   * @throws {NotFoundException} Se talhão não existe ou não pertence ao usuário
   * 
   * @example
   * ```graphql
   * query GetPlot($id: String!) {
   *   plot(id: $id) {
   *     id
   *     name
   *     area
   *     soilType
   *     farm {
   *       name
   *       location
   *     }
   *     plantings {
   *       cropType
   *       status
   *       plantingDate
   *     }
   *   }
   * }
   * ```
   */
  @Query(() => Plot, {
    name: 'plot',
    description: 'Busca um talhão específico por ID',
  })
  async findOne(
    @Args('id', { description: 'ID do talhão' }) id: string,
    @CurrentUser('id') userId: string,
  ): Promise<Plot> {
    return this.plotsService.findOne(id, userId);
  }

  /**
   * Mutation para atualizar talhão.
   * 
   * @param id - ID do talhão
   * @param userId - ID do usuário autenticado
   * @param updatePlotInput - Dados a atualizar
   * @returns Promise<Plot> Talhão atualizado
   * @throws {NotFoundException} Se talhão não existe
   * 
   * @example
   * ```graphql
   * mutation UpdatePlot($id: String!, $input: UpdatePlotInput!) {
   *   updatePlot(id: $id, updatePlotInput: $input) {
   *     id
   *     name
   *     area
   *     soilType
   *   }
   * }
   * ```
   */
  @Mutation(() => Plot, {
    description: 'Atualiza dados de um talhão',
  })
  async updatePlot(
    @Args('id', { description: 'ID do talhão' }) id: string,
    @CurrentUser('id') userId: string,
    @Args('updatePlotInput') updatePlotInput: UpdatePlotInput,
  ): Promise<Plot> {
    return this.plotsService.update(id, userId, updatePlotInput);
  }

  /**
   * Mutation para remover talhão.
   * 
   * ATENÇÃO: Remove talhão e todos os plantios/colheitas associados.
   * Não permite remoção se há plantios ativos.
   * 
   * @param id - ID do talhão
   * @param userId - ID do usuário autenticado
   * @returns Promise<Boolean> true se removido
   * @throws {NotFoundException} Se talhão não existe
   * @throws {BadRequestException} Se há plantios ativos
   * 
   * @example
   * ```graphql
   * mutation RemovePlot($id: String!) {
   *   removePlot(id: $id)
   * }
   * ```
   */
  @Mutation(() => Boolean, {
    description: 'Remove um talhão (não permite se há plantios ativos)',
  })
  async removePlot(
    @Args('id', { description: 'ID do talhão' }) id: string,
    @CurrentUser('id') userId: string,
  ): Promise<boolean> {
    return this.plotsService.remove(id, userId);
  }
}
