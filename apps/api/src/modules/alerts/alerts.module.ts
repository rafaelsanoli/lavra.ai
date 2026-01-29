import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsResolver } from './alerts.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AlertsResolver, AlertsService],
  exports: [AlertsService],
})
export class AlertsModule {}
