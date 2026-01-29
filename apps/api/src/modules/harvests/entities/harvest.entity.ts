import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

// Entidade simplificada de Planting para evitar dependência circular
@ObjectType({ description: 'Plantio (simplificado)' })
export class PlantingSimplified {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  cropType: string;

  @Field(() => Float)
  area: number;
}

/**
 * Representa um registro de colheita de um plantio
 */
@ObjectType({ description: 'Registro de colheita de um plantio' })
export class Harvest {
  @Field(() => ID, { description: 'ID único da colheita' })
  id: string;

  @Field(() => String, { description: 'ID do plantio colhido' })
  plantingId: string;

  @Field(() => Date, { description: 'Data da colheita' })
  harvestDate: Date;

  @Field(() => Float, { description: 'Quantidade colhida em kg' })
  quantity: number;

  @Field(() => String, { nullable: true, description: 'Qualidade (A, B, C)' })
  quality?: string;

  @Field(() => Float, { nullable: true, description: 'Preço por kg em R$' })
  price?: number;

  @Field(() => Float, { nullable: true, description: 'Valor total em R$ (calculado automaticamente)' })
  totalValue?: number;

  @Field(() => Float, { nullable: true, description: 'Produtividade em kg/ha (calculado automaticamente)' })
  productivity?: number;

  @Field(() => String, { nullable: true, description: 'Observações sobre a colheita' })
  notes?: string;

  @Field(() => Date, { description: 'Data de criação do registro' })
  createdAt: Date;

  @Field(() => Date, { description: 'Data da última atualização' })
  updatedAt: Date;

  // Relação
  @Field(() => PlantingSimplified, { description: 'Plantio relacionado' })
  planting: PlantingSimplified;
}
