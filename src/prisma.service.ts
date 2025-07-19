/**
 * Avaliador esse service vai ser usado para conectar ao banco de dados usando o Prisma Client.
 * Ele implementa as interfaces OnModuleInit e OnModuleDestroy para gerenciar a conexão
 * com o banco de dados durante o ciclo de vida do módulo.
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}