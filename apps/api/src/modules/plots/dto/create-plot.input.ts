import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, Min, MinLength } from 'class-validator';

/**
 * DTO para criação de talhão.
 * 
 * Talhão é uma subdivisão de uma fazenda, onde plantios específicos são realizados.
 * Cada talhão tem características próprias como área e tipo de solo.
 * 
 * @class CreatePlotInput
 * @example
 * ```typescript
 * const createPlotDto: CreatePlotInput = {
 *   name: 'Talhão Norte',
 *   farmId: 'farm-uuid-123',
 *   area: 50.5,
 *   soilType: 'Argiloso'
 * };
 * ```
 */
@InputType()
export class CreatePlotInput {
  /**
   * Nome identificador do talhão.
   * Deve ser único dentro da fazenda.
   * 
   * @example 'Talhão A', 'Área Norte', 'Gleba 1'
   */
  @Field()
  @IsString({ message: 'Nome deve ser um texto' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  name: string;

  /**
   * ID da fazenda à qual o talhão pertence.
   * Deve ser um UUID válido de uma fazenda existente.
   */
  @Field()
  @IsString({ message: 'ID da fazenda é obrigatório' })
  farmId: string;

  /**
   * Área do talhão em hectares.
   * Deve ser um valor positivo.
   * 
   * @minimum 0.01
   * @example 25.5, 100.0, 0.5
   */
  @Field(() => Float)
  @IsNumber({}, { message: 'Área deve ser um número' })
  @Min(0.01, { message: 'Área deve ser maior que 0' })
  area: number;

  /**
   * Tipo de solo predominante no talhão.
   * Opcional, mas importante para recomendações de plantio.
   * 
   * @example 'Argiloso', 'Arenoso', 'Siltoso', 'Latossolo'
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Tipo de solo deve ser um texto' })
  soilType?: string;
}
