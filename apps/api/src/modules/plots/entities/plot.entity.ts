import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Farm } from '../../farms/entities/farm.entity';

/**
 * Entity GraphQL para Talhão (Plot).
 * 
 * Representa uma subdivisão de uma fazenda onde plantios são realizados.
 * Um talhão pode ter múltiplos plantios ao longo do tempo.
 * 
 * @class Plot
 * @example
 * ```graphql
 * query {
 *   plot(id: "uuid") {
 *     id
 *     name
 *     area
 *     soilType
 *     farm {
 *       name
 *     }
 *     plantings {
 *       cropType
 *       status
 *     }
 *   }
 * }
 * ```
 */
@ObjectType()
export class Plot {
  /**
   * Identificador único do talhão (UUID).
   */
  @Field(() => ID)
  id: string;

  /**
   * Nome do talhão.
   * @example 'Talhão Norte', 'Gleba A'
   */
  @Field()
  name: string;

  /**
   * ID da fazenda proprietária.
   */
  @Field()
  farmId: string;

  /**
   * Área total do talhão em hectares.
   * @example 50.5, 100.0
   */
  @Field(() => Float)
  area: number;

  /**
   * Tipo de solo predominante.
   * @example 'Argiloso', 'Arenoso'
   */
  @Field({ nullable: true })
  soilType?: string;

  /**
   * Fazenda à qual o talhão pertence.
   * Relação many-to-one.
   */
  @Field(() => Farm, { nullable: true })
  farm?: Farm;

  /**
   * Lista de plantios realizados neste talhão.
   * Relação one-to-many com Planting.
   */
  @Field(() => [Planting], { nullable: true })
  plantings?: Planting[];

  /**
   * Data de criação do registro.
   */
  @Field()
  createdAt: Date;

  /**
   * Data da última atualização.
   */
  @Field()
  updatedAt: Date;
}

/**
 * Entity simplificada de Plantio para resolver circular dependency.
 * A entidade completa está em modules/plantings/entities/planting.entity.ts
 */
@ObjectType()
export class Planting {
  @Field(() => ID)
  id: string;

  @Field()
  cropType: string;

  @Field({ nullable: true })
  variety?: string;

  @Field()
  plantingDate: Date;

  @Field()
  expectedHarvest: Date;

  @Field({ nullable: true })
  actualHarvest?: Date;

  @Field()
  status: string;

  @Field(() => Float, { nullable: true })
  estimatedYield?: number;

  @Field(() => Float, { nullable: true })
  actualYield?: number;
}
