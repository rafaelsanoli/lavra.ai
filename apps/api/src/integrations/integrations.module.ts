import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { B3Service } from './services/b3.service';
import { InmetService } from './services/inmet.service';
import { NasaPowerService } from './services/nasa-power.service';
import { CepeaService } from './services/cepea.service';
import { IntegrationsResolver } from './integrations.resolver';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    CacheModule.register({
      ttl: 3600, // 1 hora padrão
      max: 100, // máximo 100 items em cache
    }),
  ],
  providers: [
    B3Service,
    InmetService,
    NasaPowerService,
    CepeaService,
    IntegrationsResolver,
  ],
  exports: [B3Service, InmetService, NasaPowerService, CepeaService],
})
export class IntegrationsModule {}
