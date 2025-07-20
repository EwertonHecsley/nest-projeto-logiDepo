import { NotFoundException } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { FindProductUseCase } from 'src/applications/useCase/product/Find';
import { Product } from 'src/core/domain/product/entity/Product';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { ProductModule } from 'src/infrastructure/http/product/product.module';
import { left, right } from 'src/shared/either';
import * as request from 'supertest';

describe('GET /api/v1/product/:id (e2e)', () => {
  let app: NestExpressApplication;
  let findProductUseCase: FindProductUseCase;

  const productFake = Product.create({
    description: 'Produto Teste',
    price: 100,
    quantity: 10,
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProductModule],
    })
      .overrideProvider(FindProductUseCase)
      .useValue({
        execute: jest.fn(),
      })
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() })
      .compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    await app.init();

    findProductUseCase = moduleRef.get(FindProductUseCase);
  });

  interface ErrorResponse {
    message: string;
  }

  it('Deve encontrar um produto com sucesso.', async () => {
    (findProductUseCase.execute as jest.Mock).mockResolvedValue(
      right(productFake),
    );

    const res = await request(app.getHttpServer()).get(
      `/api/v1/product/${productFake.id.toString}`,
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Produto encontrado com sucesso.',
      product: {
        id: productFake.id.toString,
        description: productFake.description,
        quantity: productFake.quantity,
        price: productFake.formattedPrice,
        createdAt: productFake.formattedCreatedAt,
      },
    });
  });

  it('Deve retornar erro se um produto nao for encontrado.', async () => {
    (findProductUseCase.execute as jest.Mock).mockResolvedValue(
      left(new NotFoundException('Produto nao encontrado.')),
    );

    const res = await request(app.getHttpServer()).get(
      `/api/v1/product/uuid-nao-existente`,
    );

    const body = res.body as ErrorResponse;

    expect(res.status).toBe(404);
    expect(body.message).toBe('Produto nao encontrado.');
  });

  afterAll(async () => {
    await app.close();
  });
});
