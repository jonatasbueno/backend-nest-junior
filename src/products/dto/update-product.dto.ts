/**
 * Avaliador: item o comentário do arquivo create-product-dto.ts
 */

import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  @Min(0.01)
  price?: number;

  @IsString()
  @IsOptional()
  sku?: string;
}