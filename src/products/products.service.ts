/**
 * Esse ProductService é uma class com inversão de dependência
 * nela o método de achar a letra faltante é a findFirstAbsenteLetter
 * o PrismaSerive e recebido por meio de injeção de depência
 * existe um constante PRODUCT_EXISTS que representa violação ao tentar inserir um valor que deveria ser único
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Product } from 'generated/prisma';

const PRODUTO_EXISTS = 'P2002'
const TOTAL_LETRAS_ALFABETO = 26

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private findFirstAbsentLetter(name: string): string {
    // aqui eu normalizado tudo em minúscula, removo tudo que não for letra e adiciona num estrutura de dados irreptível
    const letters = new Set(name.toLowerCase().replace(/[^a-z]/g, ''));

    for (let i = 0; i < TOTAL_LETRAS_ALFABETO; i++) {
      // converte o código unicode para letra minúscula
      // as letras minúsculas começam em 97, por isso da soma com i
      // ai eu verifico se a estrutura de dados não tem a letra e retorno ela
      const letter = String.fromCharCode(97 + i);
      if (!letters.has(letter)) {
        return letter;
      }
    }
    // caso a estrutura de dados tenha todas as letras, eu retorno underscore
    return '_';
  }

  async createProduct(data: { name: string; price: number; sku: string }): Promise<Product> {
    try {
      return await this.prisma.product.create({ data });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('SKU já existe');
      }
      throw error;
    }
  }

  async getProducts(): Promise<(Product & { absentLetter: string })[]> {
    const products = await this.prisma.product.findMany({ orderBy: { name: 'asc' } });
    return products.map(product => ({
      ...product,
      absentLetter: this.findFirstAbsentLetter(product.name),
    }));
  }

  async getProduct(id: number): Promise<(Product & { absentLetter: string }) | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) return null;
    return {
      ...product,
      absentLetter: this.findFirstAbsentLetter(product.name),
    };
  }

  async updateProduct(id: number, data: Partial<{ name: string; price: number; sku: string }>): Promise<Product> {
    try {
      return await this.prisma.product.update({ where: { id }, data });
    } catch (error) {
      if (error.code === PRODUTO_EXISTS) {
        throw new BadRequestException('SKU já existe');
      }
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<Product> {
    return await this.prisma.product.delete({ where: { id } });
  }
}