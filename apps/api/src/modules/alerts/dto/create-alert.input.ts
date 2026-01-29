import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsString, IsOptional, IsDateString, MaxLength } from 'class-validator';

export enum AlertType {
  WEATHER = 'WEATHER',
  MARKET = 'MARKET',
  DISEASE = 'DISEASE',
  PEST = 'PEST',
  HARVEST = 'HARVEST',
  IRRIGATION = 'IRRIGATION',
}

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// Register enums for GraphQL
registerEnumType(AlertType, { name: 'AlertType' });
registerEnumType(AlertSeverity, { name: 'AlertSeverity' });

@InputType()
export class CreateAlertInput {
  @Field(() => AlertType)
  @IsEnum(AlertType)
  type: AlertType;

  @Field(() => AlertSeverity)
  @IsEnum(AlertSeverity)
  severity: AlertSeverity;

  @Field()
  @IsString()
  @MaxLength(200)
  title: string;

  @Field()
  @IsString()
  @MaxLength(1000)
  message: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  metadata?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
