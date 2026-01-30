import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class InmetStationDto {
  @Field()
  code: string;

  @Field()
  name: string;

  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @Field()
  uf: string; // Estado

  @Field()
  municipality: string;
}

@ObjectType()
export class InmetWeatherDataDto {
  @Field()
  stationCode: string;

  @Field()
  timestamp: Date;

  @Field(() => Float, { nullable: true })
  temperature?: number; // °C

  @Field(() => Float, { nullable: true })
  humidity?: number; // %

  @Field(() => Float, { nullable: true })
  pressure?: number; // hPa

  @Field(() => Float, { nullable: true })
  windSpeed?: number; // m/s

  @Field(() => Float, { nullable: true })
  windDirection?: number; // graus

  @Field(() => Float, { nullable: true })
  precipitation?: number; // mm

  @Field(() => Float, { nullable: true })
  solarRadiation?: number; // W/m²

  @Field({ nullable: true })
  condition?: string; // ensolarado, nublado, chuva, etc
}

@ObjectType()
export class InmetForecastDto {
  @Field()
  municipality: string;

  @Field()
  uf: string;

  @Field()
  date: Date;

  @Field(() => Float)
  minTemperature: number;

  @Field(() => Float)
  maxTemperature: number;

  @Field(() => Float)
  precipitationProbability: number; // %

  @Field(() => Float, { nullable: true })
  precipitationAmount?: number; // mm

  @Field()
  condition: string;

  @Field(() => Float, { nullable: true })
  humidity?: number;
}
