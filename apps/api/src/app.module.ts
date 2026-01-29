import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

// Modules
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { FarmsModule } from './modules/farms/farms.module';
import { PlotsModule } from './modules/plots/plots.module';
import { PlantingsModule } from './modules/plantings/plantings.module';
import { HarvestsModule } from './modules/harvests/harvests.module';
import { ClimateDataModule } from './modules/climate-data/climate-data.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { MarketPricesModule } from './modules/market-prices/market-prices.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { SimulationsModule } from './modules/simulations/simulations.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),

    // Database
    PrismaModule,

    // Feature modules
    AuthModule,
    UsersModule,
    FarmsModule,
    PlotsModule,
    PlantingsModule,
    HarvestsModule,
    ClimateDataModule,
    AlertsModule,
    MarketPricesModule,
    TransactionsModule,
    SimulationsModule,
  ],
})
export class AppModule {}
