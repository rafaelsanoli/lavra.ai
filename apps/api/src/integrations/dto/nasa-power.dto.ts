import { ObjectType, Field, Float } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class NasaPowerParametersDto {
  @Field(() => Float, { nullable: true })
  T2M?: number; // Temperature at 2 Meters (°C)

  @Field(() => Float, { nullable: true })
  T2M_MAX?: number; // Temperature at 2 Meters Maximum (°C)

  @Field(() => Float, { nullable: true })
  T2M_MIN?: number; // Temperature at 2 Meters Minimum (°C)

  @Field(() => Float, { nullable: true })
  PRECTOTCORR?: number; // Precipitation Corrected (mm/day)

  @Field(() => Float, { nullable: true })
  RH2M?: number; // Relative Humidity at 2 Meters (%)

  @Field(() => Float, { nullable: true })
  WS2M?: number; // Wind Speed at 2 Meters (m/s)

  @Field(() => Float, { nullable: true })
  ALLSKY_SFC_SW_DWN?: number; // All Sky Surface Shortwave Downward Irradiance (kW-hr/m²/day)

  @Field(() => Float, { nullable: true })
  ALLSKY_SFC_PAR_TOT?: number; // All Sky Surface PAR Total (einstein/m²/day)
}

@ObjectType()
export class NasaPowerDailyDataDto {
  @Field()
  date: Date;

  @Field(() => NasaPowerParametersDto)
  parameters: NasaPowerParametersDto;
}

@ObjectType()
export class NasaPowerDataDto {
  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field(() => [NasaPowerDailyDataDto])
  data: NasaPowerDailyDataDto[];

  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: any;
}

@ObjectType()
export class NasaPowerAgriculturalIndicesDto {
  @Field()
  date: Date;

  @Field(() => Float)
  evapotranspiration: number; // mm/day

  @Field(() => Float)
  waterDeficit: number; // mm

  @Field(() => Float)
  growingDegreeDays: number; // °C-days

  @Field(() => Float)
  frostRiskIndex: number; // 0-1

  @Field(() => Float)
  heatStressIndex: number; // 0-1
}
