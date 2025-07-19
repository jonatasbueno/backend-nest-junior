/**
 * Avaliador: aqui eu adicionei o service PrismaService como provider do módulo ProductsModule.
 */

import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService]
})
export class ProductsModule {}
