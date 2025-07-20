import { BadRequestException } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { CreateProductUseCase } from 'src/applications/useCase/product/Create';
import { Product } from 'src/core/domain/product/entity/Product';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { ProductModule } from 'src/infrastructure/http/product/product.module';
import { left, right } from 'src/shared/either';
import * as request from 'supertest';

describe('POST /api/v1/product (e2e)', () => {
  let app: NestExpressApplication;
  let createProductUseCase: CreateProductUseCase;

  const mockProduct = Product.create({
    description: 'Produto Teste',
    price: 100,
    quantity: 10,
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProductModule],
    })
      .overrideProvider(CreateProductUseCase)
      .useValue({
        execute: jest.fn(),
      })

      .overrideProvider(PrismaService)
      .useValue({
        $connect: jest.fn(),
      })
      .compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    await app.init();

    createProductUseCase = moduleRef.get(CreateProductUseCase);
  });

  interface ErrorResponse {
    message: string;
  }

  it('Deve criar um Produto com sucesso.', async () => {
    (createProductUseCase.execute as jest.Mock).mockResolvedValue(
      right(mockProduct),
    );

    const res = await request(app.getHttpServer())
      .post('/api/v1/product')
      .send({
        description: 'Produto Teste',
        price: 100,
        quantity: 10,
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: 'Produto criado com sucesso.',
      product: {
        id: mockProduct.id.toString,
        description: mockProduct.description,
        price: mockProduct.formattedPrice,
        quantity: mockProduct.quantity,
        createdAt: mockProduct.formattedCreatedAt,
      },
    });
  });

  it('Deve retornar erro ao tentar criar um Produto com dados inválidos.', async () => {
    (createProductUseCase.execute as jest.Mock).mockResolvedValue(
      left(
        new BadRequestException('Preco e quantidade não podem ser negativas.'),
      ),
    );

    const res = await request(app.getHttpServer())
      .post('/api/v1/product')
      .send({
        description: 'Teste Produto 2',
        price: -100,
        quantity: -10,
      });

    const body = res.body as ErrorResponse;

    expect(res.status).toBe(400);
    expect(body.message).toBe('Preco e quantidade não podem ser negativas.');
  });

  afterAll(async () => {
    await app.close();
  });
});
