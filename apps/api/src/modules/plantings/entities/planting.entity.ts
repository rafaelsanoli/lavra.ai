import { ObjectType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';
import { PlantingStatus } from '../dto/update-planting.input';

// Entidade simplificada de Plot para evitar dependência circular
@ObjectType({ description: 'Talhão (simplificado)' })
export class PlotSimplified {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => Float)
  area: number;
}

// Entidade simplificada de Harvest
@ObjectType({ description: 'Colheita (simplificada)' })
export class HarvestSimplified {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  harvestDate: Date;

  @Field(() => Float)
  quantity: number;

  @Field(() => String, { nullable: true })
  quality?: string;
}

/**
 * Representa um plantio realizado em um talhão
 */
@ObjectType({ description: 'Plantio realizado em um talhão' })
export class Planting {
  @Field(() => ID, { description: 'ID único do plantio' })
  id: string;

  @Field(() => String, { description: 'ID do talhão' })
  plotId: string;

  @Field(() => String, { description: 'Tipo de cultura plantada (Soja, Milho, Café)' })
  cropType: string;

  @Field(() => String, { nullable: true, description: 'Variedade da cultura' })
  variety?: string;

  @Field(() => Float, { description: 'Área plantada em hectares' })
  area: number;

  @Field(() => Date, { description: 'Data do plantio' })
  plantingDate: Date;

  @Field(() => Date, { description: 'Data esperada da colheita' })
  expectedHarvest: Date;

  @Field(() => Date, { nullable: true, description: 'Data real da colheita' })
  actualHarvest?: Date;

  @Field(() => PlantingStatus, { description: 'Status atual do plantio' })
  status: PlantingStatus;

  @Field(() => Float, { nullable: true, description: 'Produtividade estimada em kg/hectare' })
  estimatedYield?: number;

  @Field(() => Float, { nullable: true, description: 'Produtividade real em kg/hectare' })
  actualYield?: number;

  @Field(() => String, { nullable: true, description: 'Observações sobre o plantio' })
  notes?: string;

  @Field(() => Date, { description: 'Data de criação do registro' })
  createdAt: Date;

  @Field(() => Date, { description: 'Data da última atualização' })
  updatedAt: Date;

  // Relações
  @Field(() => PlotSimplified, { description: 'Talhão onde o plantio foi realizado' })
  plot: PlotSimplified;

  @Field(() => [HarvestSimplified], {
    nullable: 'itemsAndList',
    description: 'Colheitas deste plantio'
  })
  harvests?: HarvestSimplified[];
}
