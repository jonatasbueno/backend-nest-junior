/**
 * Esse constroller contém todos os endpoints para as request desejadas
 * Inclui:
 *  - Body, Param (parar captura dos parans e pipes)
 *  - UsePipes e Validation Pipe (para usar o pipe de validação dos dtos)
 * Esse controle recebe o ProductService como injeção de dependencia para processar os dados
 */

import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createProduct(@Body() data: CreateProductDto) {
    return this.productsService.createProduct(data);
  }

  @Get()
  async getProducts() {
    return this.productsService.getProducts();
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(Number(id));
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateProduct(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.productsService.updateProduct(Number(id), data);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(Number(id));
  }
}