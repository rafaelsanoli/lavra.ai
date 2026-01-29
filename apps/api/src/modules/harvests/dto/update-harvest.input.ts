import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

/**
 * DTO para atualização de uma colheita existente
 */
@InputType()
export class UpdateHarvestInput {
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
