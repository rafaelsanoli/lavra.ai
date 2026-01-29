import { InputType, Field, Float, registerEnumType } from '@nestjs/graphql';
import { IsString, IsNumber, IsDateString, IsOptional, IsEnum, Min } from 'class-validator';

/**
 * Status possíveis de um plantio
 */
export enum PlantingStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  HARVESTED = 'HARVESTED',
  FAILED = 'FAILED'
}

registerEnumType(PlantingStatus, {
  name: 'PlantingStatus',
  description: 'Status do plantio',
  valuesMap: {
    PLANNED: { description: 'Planejado' },
    IN_PROGRESS: { description: 'Em andamento' },
    HARVESTED: { description: 'Colhido' },
    FAILED: { description: 'Perdido/Falhou' }
  }
});

/**
 * DTO para atualização de um plantio existente
 */
@InputType()
export class UpdatePlantingInput {
  @Field(() => PlantingStatus, { nullable: true, description: 'Novo status do plantio' })
  @IsEnum(PlantingStatus, { message: 'Status deve ser PLANNED, IN_PROGRESS, HARVESTED ou FAILED' })
  @IsOptional()
  status?: PlantingStatus;

  @Field(() => String, { nullable: true, description: 'Data real da colheita (formato ISO 8601)' })
  @IsDateString({}, { message: 'Data de colheita inválida' })
  @IsOptional()
  actualHarvest?: string;

  @Field(() => Float, { nullable: true, description: 'Produtividade real em kg/hectare' })
  @IsNumber({}, { message: 'Produtividade real deve ser um número' })
  @Min(0, { message: 'Produtividade real deve ser positiva' })
  @IsOptional()
  actualYield?: number;

  @Field(() => String, { nullable: true, description: 'Observações sobre o plantio' })
  @IsString({ message: 'Observações devem ser uma string' })
  @IsOptional()
  notes?: string;
}
