import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { FornecedorModule } from 'src/infrastructure/http/Fornecedor/fornecedor.module';
import { UpdateFornecedorUseCase } from 'src/applications/useCase/fornecedor/Update';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { right, left } from 'src/shared/either';
import { BadRequestException } from '@nestjs/common';

describe('PUT /api/v1/fornecedor/:id (e2e)', () => {
  let app: NestExpressApplication;
  let updateFornecedorUseCase: UpdateFornecedorUseCase;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [FornecedorModule],
    })
      .overrideProvider(UpdateFornecedorUseCase)
      .useValue({
        execute: jest.fn(),
      })
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() }) // evita conexão real
      .compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    await app.init();

    updateFornecedorUseCase = moduleRef.get(UpdateFornecedorUseCase);
  });

  interface ErrorResponse {
    message: string;
  }

  it('deve atualizar um fornecedor com sucesso', async () => {
    (updateFornecedorUseCase.execute as jest.Mock).mockResolvedValue(
      right(null),
    );

    const res = await request(app.getHttpServer())
      .put('/api/v1/fornecedor/uuid-valido')
      .send({
        razaoSocial: 'Fornecedor Atualizado',
        cnpj: '98.765.432/0001-10',
        email: 'atualizado@empresa.com',
      });

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });

  it('deve retornar erro se o fornecedor não for encontrado', async () => {
    (updateFornecedorUseCase.execute as jest.Mock).mockResolvedValue(
      left(new BadRequestException('Fornecedor não encontrado.')),
    );

    const res = await request(app.getHttpServer())
      .put('/api/v1/fornecedor/uuid-invalido')
      .send({
        razaoSocial: 'Qualquer Nome',
        cnpj: '00.000.000/0001-00',
        email: 'invalido@empresa.com',
      });

    const body = res.body as ErrorResponse;

    expect(res.status).toBe(400);
    expect(body.message).toBe('Fornecedor não encontrado.');
  });

  afterAll(async () => {
    await app.close();
  });
});
