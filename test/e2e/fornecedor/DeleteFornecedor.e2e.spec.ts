import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { FornecedorModule } from 'src/infrastructure/http/Fornecedor/fornecedor.module';
import { DeleteFornecedorUseCase } from 'src/applications/useCase/fornecedor/Delete';
import { right, left } from 'src/shared/either';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';

describe('DELETE /fornecedor/:id (e2e)', () => {
  let app: NestExpressApplication;
  let deleteFornecedorUseCase: DeleteFornecedorUseCase;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [FornecedorModule],
    })
      .overrideProvider(DeleteFornecedorUseCase)
      .useValue({
        execute: jest.fn(),
      })
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() }) // evita conexão real
      .compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    await app.init();

    deleteFornecedorUseCase = moduleRef.get(DeleteFornecedorUseCase);
  });

  interface ErrorResponse {
    message: string;
  }

  it('deve deletar um fornecedor com sucesso', async () => {
    (deleteFornecedorUseCase.execute as jest.Mock).mockResolvedValue(
      right(null),
    );

    const res = await request(app.getHttpServer()).delete(
      '/fornecedor/uuid-valido',
    );

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });

  it('deve retornar erro se o fornecedor não for encontrado', async () => {
    (deleteFornecedorUseCase.execute as jest.Mock).mockResolvedValue(
      left(new BadRequestException('Fornecedor não encontrado.')),
    );

    const res = await request(app.getHttpServer()).delete(
      '/fornecedor/uuid-invalido',
    );

    const body = res.body as ErrorResponse;

    expect(res.status).toBe(400);
    expect(body.message).toBe('Fornecedor não encontrado.');
  });

  afterAll(async () => {
    await app.close();
  });
});
