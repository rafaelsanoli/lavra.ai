import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Serviço customizado de logging para aplicação.
 * 
 * Implementa interface NestLoggerService e adiciona funcionalidades extras:
 * - Diferentes níveis de log (debug, info, warn, error)
 * - Contexto para rastreamento
 * - Formatação consistente
 * - Preparado para integração com Winston/ELK Stack
 * 
 * @class LoggerService
 * @implements {NestLoggerService}
 * 
 * @example
 * ```typescript
 * constructor(private logger: LoggerService) {
 *   this.logger.setContext('FarmsService');
 * }
 * 
 * async create(data: CreateFarmInput) {
 *   this.logger.log(`Creating farm: ${data.name}`);
 *   // ...
 *   this.logger.log(`Farm created successfully: ${farm.id}`);
 * }
 * ```
 */
@Injectable()
export class LoggerService implements NestLoggerService {
  private context?: string;
  private isProduction: boolean;

  constructor(private configService: ConfigService) {
    this.isProduction = this.configService?.get('NODE_ENV') === 'production';
  }

  /**
   * Define o contexto do logger (classe, módulo, etc).
   * 
   * @param context - Nome do contexto (ex: 'FarmsService', 'AuthModule')
   */
  setContext(context: string) {
    this.context = context;
  }

  /**
   * Log de informação geral.
   * 
   * @param message - Mensagem a ser logada
   * @param context - Contexto opcional (sobrescreve o padrão)
   */
  log(message: string, context?: string) {
    const ctx = context || this.context;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] [${ctx}] ${message}`);
  }

  /**
   * Log de erro com stack trace opcional.
   * 
   * @param message - Mensagem de erro
   * @param trace - Stack trace do erro
   * @param context - Contexto opcional
   */
  error(message: string, trace?: string, context?: string) {
    const ctx = context || this.context;
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] [${ctx}] ${message}`);
    if (trace) {
      console.error(`Stack trace:\n${trace}`);
    }
  }

  /**
   * Log de warning/alerta.
   * 
   * @param message - Mensagem de warning
   * @param context - Contexto opcional
   */
  warn(message: string, context?: string) {
    const ctx = context || this.context;
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [WARN] [${ctx}] ${message}`);
  }

  /**
   * Log de debug (apenas em desenvolvimento).
   * 
   * @param message - Mensagem de debug
   * @param context - Contexto opcional
   */
  debug(message: string, context?: string) {
    if (this.isProduction) return;

    const ctx = context || this.context;
    const timestamp = new Date().toISOString();
    console.debug(`[${timestamp}] [DEBUG] [${ctx}] ${message}`);
  }

  /**
   * Log verbose (informações detalhadas).
   * 
   * @param message - Mensagem verbose
   * @param context - Contexto opcional
   */
  verbose(message: string, context?: string) {
    if (this.isProduction) return;

    const ctx = context || this.context;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [VERBOSE] [${ctx}] ${message}`);
  }

  /**
   * Log de operação de banco de dados.
   * 
   * @param operation - Tipo de operação (create, update, delete, query)
   * @param model - Nome do model
   * @param data - Dados relevantes (opcional)
   */
  logDatabase(operation: string, model: string, data?: any) {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` | Data: ${JSON.stringify(data)}` : '';
    console.log(
      `[${timestamp}] [DB] [${this.context}] ${operation.toUpperCase()} ${model}${dataStr}`,
    );
  }

  /**
   * Log de requisição HTTP/GraphQL.
   * 
   * @param method - Método HTTP ou operação GraphQL
   * @param url - URL ou query name
   * @param userId - ID do usuário (se autenticado)
   * @param duration - Duração em ms
   */
  logRequest(
    method: string,
    url: string,
    userId?: string,
    duration?: number,
  ) {
    const timestamp = new Date().toISOString();
    const userStr = userId ? ` | User: ${userId}` : '';
    const durationStr = duration ? ` | ${duration}ms` : '';
    console.log(
      `[${timestamp}] [REQUEST] ${method} ${url}${userStr}${durationStr}`,
    );
  }

  /**
   * Log de autenticação.
   * 
   * @param event - Tipo de evento (login, logout, register, etc)
   * @param userId - ID do usuário
   * @param email - Email do usuário
   * @param success - Se operação foi bem sucedida
   */
  logAuth(event: string, userId: string, email: string, success: boolean) {
    const timestamp = new Date().toISOString();
    const status = success ? 'SUCCESS' : 'FAILED';
    console.log(
      `[${timestamp}] [AUTH] ${event.toUpperCase()} ${status} | User: ${userId} | Email: ${email}`,
    );
  }
}
