// importando módulo e classe de teste 
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: any;

  beforeEach(async () => {
    // antes de cada test é criado um módulo que mocka o PrimeService
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    // define variáveis com os services instanciados
    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const data = { name: 'Test', price: 10, sku: 'TEST123' };
      const expected = { id: 1, ...data };
      prisma.product.create.mockResolvedValue(expected);
      const result = await service.createProduct(data);
      // testa retorno da função create
      expect(result).toEqual(expected);
      expect(prisma.product.create).toHaveBeenCalledWith({ data });
    });

    it('should throw if SKU exists', async () => {
      const data = { name: 'Test', price: 10, sku: 'TEST123' };
      prisma.product.create.mockRejectedValue({ code: 'P2002' });
      // testa excessao ao tentar criar dois produtos iguals
      await expect(service.createProduct(data)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getProducts', () => {
    it('should return products with absentLetter', async () => {
      const products = [
        { id: 1, name: 'Apple', price: 10, sku: 'APPLE123' },
      ];
      prisma.product.findMany.mockResolvedValue(products);
      const result = await service.getProducts();
      // testa a letra retornada
      expect(result).toEqual([
        { ...products[0], absentLetter: 'b' },
      ]);
      expect(prisma.product.findMany).toHaveBeenCalledWith({ orderBy: { name: 'asc' } });
    });
  });
});