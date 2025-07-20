import { NotFoundException } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { DeleteProductUseCase } from 'src/applications/useCase/product/Delete';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { ProductModule } from 'src/infrastructure/http/product/product.module';
import { left, right } from 'src/shared/either';
import * as request from 'supertest';

describe('DELETE /api/v1/product/:id (e2e)', () => {
  let app: NestExpressApplication;
  let deleteProductUseCase: DeleteProductUseCase;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProductModule],
    })
      .overrideProvider(DeleteProductUseCase)
      .useValue({
        execute: jest.fn(),
      })
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() })
      .compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    await app.init();

    deleteProductUseCase = moduleRef.get(DeleteProductUseCase);
  });

  interface ErrorResponse {
    message: string;
  }

  it('Deve deletar um produto com sucesso,', async () => {
    (deleteProductUseCase.execute as jest.Mock).mockResolvedValue(right(null));

    const res = await request(app.getHttpServer()).delete(
      '/api/v1/product/uuid-valido',
    );

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });

  it('Deve retornar erro se o produto nao for encontrado.', async () => {
    (deleteProductUseCase.execute as jest.Mock).mockResolvedValue(
      left(new NotFoundException('Produto nao encontrado.')),
    );

    const res = await request(app.getHttpServer()).delete(
      '/api/v1/product/uuid-invalido',
    );

    const body = res.body as ErrorResponse;

    expect(res.status).toBe(404);
    expect(body.message).toBe('Produto nao encontrado.');
  });

  afterAll(async () => {
    await app.close();
  });
});
