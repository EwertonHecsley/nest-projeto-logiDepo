import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { ListAllUseCase } from 'src/applications/useCase/product/List';
import { Product } from 'src/core/domain/product/entity/Product';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { ProductModule } from 'src/infrastructure/http/product/product.module';
import { right } from 'src/shared/either';
import * as request from 'supertest';

describe('GET /api/v1/product (e2e)', () => {
  let app: NestExpressApplication;
  let listAllProductUseCase: ListAllUseCase;

  const productFake = Product.create({
    description: 'Produto teste',
    quantity: 100,
    price: 10,
  });

  const paginatedResponse = {
    data: [productFake],
    total: 1,
    page: 1,
    limit: 10,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProductModule],
    })
      .overrideProvider(ListAllUseCase)
      .useValue({
        execute: jest.fn(),
      })
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() })
      .compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    await app.init();

    listAllProductUseCase = moduleRef.get(ListAllUseCase);
  });

  it('deve retornar uma lista paginada de produtos com sucesso', async () => {
    (listAllProductUseCase.execute as jest.Mock).mockResolvedValue(
      right(paginatedResponse),
    );

    const res = await request(app.getHttpServer())
      .get('/api/v1/product?page=1&limit=10')
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Produtos listados com sucesso.',
      data: [
        {
          id: productFake.id.toString,
          description: productFake.description,
          quantity: productFake.quantity,
          price: productFake.formattedPrice,
          createdAt: productFake.formattedCreatedAt,
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
