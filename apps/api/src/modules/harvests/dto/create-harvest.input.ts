import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsDateString, IsOptional, Min } from 'class-validator';

/**
 * DTO para criação de um novo registro de colheita
 */
@InputType()
export class CreateHarvestInput {
  @Field(() => String, { description: 'ID do plantio que está sendo colhido' })
  @IsString({ message: 'plantingId deve ser uma string' })
  plantingId: string;

  @Field(() => String, { description: 'Data da colheita (formato ISO 8601)' })
  @IsDateString({}, { message: 'Data de colheita inválida' })
  harvestDate: string;

  @Field(() => Float, { description: 'Quantidade colhida em kg' })
  @IsNumber({}, { message: 'Quantidade deve ser um número' })
  @Min(0.01, { message: 'Quantidade deve ser maior que 0' })
  quantity: number;

  @Field(() => String, { nullable: true, description: 'Qualidade da colheita (A, B, C)' })
  @IsString({ message: 'Qualidade deve ser uma string' })
  @IsOptional()
  quality?: string;

  @Field(() => Float, { nullable: true, description: 'Preço por kg em R$' })
  @IsNumber({}, { message: 'Preço deve ser um número' })
  @Min(0, { message: 'Preço deve ser positivo' })
  @IsOptional()
  price?: number;

  @Field(() => String, { nullable: true, description: 'Observações sobre a colheita' })
  @IsString({ message: 'Observações devem ser uma string' })
  @IsOptional()
  notes?: string;
}
