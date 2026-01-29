import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, Min, MinLength } from 'class-validator';

/**
 * DTO para atualização de talhão.
 * Todos os campos são opcionais - apenas os fornecidos serão atualizados.
 * 
 * @class UpdatePlotInput
 * @example
 * ```typescript
 * const updatePlotDto: UpdatePlotInput = {
 *   area: 55.0,  // Ajustar área
 *   soilType: 'Argiloso com calcário'  // Atualizar análise de solo
 * };
 * ```
 */
@InputType()
export class UpdatePlotInput {
  /**
   * Novo nome para o talhão (opcional).
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Nome deve ser um texto' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  name?: string;

  /**
   * Nova área do talhão em hectares (opcional).
   * Útil quando há remapeamento ou correções de medição.
   */
  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Área deve ser um número' })
  @Min(0.01, { message: 'Área deve ser maior que 0' })
  area?: number;

  /**
   * Novo tipo de solo (opcional).
   * Atualizar quando há nova análise de solo.
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Tipo de solo deve ser um texto' })
  soilType?: string;
}
