import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Product } from 'generated/prisma';


@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  /** função para encontrar a primeira letra ausente  */
  private findFirstAbsentLetter(name: string): string {
    const letters = new Set(name.toLowerCase().replace(/[^a-z]/g, ''));
    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(97 + i);
      if (!letters.has(letter)) {
        return letter;
      }
    }
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
      if (error.code === 'P2002') {
        throw new BadRequestException('SKU já existe');
      }
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<Product> {
    return await this.prisma.product.delete({ where: { id } });
  }
}