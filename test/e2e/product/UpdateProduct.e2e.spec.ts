import { NotFoundException } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { UpdateProductUseCase } from 'src/applications/useCase/product/Update';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { ProductModule } from 'src/infrastructure/http/product/product.module';
import { left, right } from 'src/shared/either';
import * as request from 'supertest';

describe('PUT /api/v1/product/:id (e2e)', () => {
  let app: NestExpressApplication;
  let updateProductUseCase: UpdateProductUseCase;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProductModule],
    })
      .overrideProvider(UpdateProductUseCase)
      .useValue({
        execute: jest.fn(),
      })
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() })
      .compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    await app.init();

    updateProductUseCase = moduleRef.get(UpdateProductUseCase);
  });

  interface ErrorResponse {
    message: string;
  }

  it('deve atualizar um produto com sucesso', async () => {
    (updateProductUseCase.execute as jest.Mock).mockResolvedValue(right(null));

    const res = await request(app.getHttpServer())
      .put('/api/v1/product/uuid-valido')
      .send({
        description: 'Produto Atualizado',
        quantity: 200,
        price: 80,
      });

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });

  it('deve retornar erro se o produto não for encontrado', async () => {
    (updateProductUseCase.execute as jest.Mock).mockResolvedValue(
      left(new NotFoundException('Produto não encontrado.')),
    );

    const res = await request(app.getHttpServer())
      .put('/api/v1/product/uuid-invalido')
      .send({
        description: 'NomeQualquer',
      });

    const body = res.body as ErrorResponse;

    expect(res.status).toBe(404);
    expect(body.message).toBe('Produto não encontrado.');
  });

  afterAll(async () => {
    await app.close();
  });
});
