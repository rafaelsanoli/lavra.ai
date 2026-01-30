import { Module, forwardRef } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsResolver } from './alerts.resolver';
import { PrismaModule } from '../../prisma/prisma.module';
import { WebsocketsModule } from '../../websockets/websockets.module';

@Module({
  imports: [PrismaModule, forwardRef(() => WebsocketsModule)],
  providers: [AlertsResolver, AlertsService],
  exports: [AlertsService],
})
export class AlertsModule {}
