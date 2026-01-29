import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsDateString, IsOptional, MinLength, Min } from 'class-validator';

/**
 * DTO para criação de um novo plantio
 */
@InputType()
export class CreatePlantingInput {
  @Field(() => String, { description: 'ID do talhão onde será realizado o plantio' })
  @IsString({ message: 'plotId deve ser uma string' })
  plotId: string;

  @Field(() => String, { description: 'Tipo de cultura (Soja, Milho, Café, etc)' })
  @IsString({ message: 'Tipo de cultura deve ser uma string' })
  @MinLength(2, { message: 'Tipo de cultura deve ter no mínimo 2 caracteres' })
  cropType: string;

  @Field(() => String, { nullable: true, description: 'Variedade da cultura' })
  @IsString({ message: 'Variedade deve ser uma string' })
  @IsOptional()
  variety?: string;

  @Field(() => Float, { description: 'Área plantada em hectares' })
  @IsNumber({}, { message: 'Área deve ser um número' })
  @Min(0.01, { message: 'Área deve ser maior que 0' })
  area: number;

  @Field(() => String, { description: 'Data do plantio (formato ISO 8601)' })
  @IsDateString({}, { message: 'Data de plantio inválida' })
  plantingDate: string;

  @Field(() => String, { description: 'Data esperada da colheita (formato ISO 8601)' })
  @IsDateString({}, { message: 'Data esperada de colheita inválida' })
  expectedHarvest: string;

  @Field(() => Float, { nullable: true, description: 'Produtividade estimada em kg/hectare' })
  @IsNumber({}, { message: 'Produtividade estimada deve ser um número' })
  @Min(0, { message: 'Produtividade estimada deve ser positiva' })
  @IsOptional()
  estimatedYield?: number;

  @Field(() => String, { nullable: true, description: 'Observações sobre o plantio' })
  @IsString({ message: 'Observações devem ser uma string' })
  @IsOptional()
  notes?: string;
}
