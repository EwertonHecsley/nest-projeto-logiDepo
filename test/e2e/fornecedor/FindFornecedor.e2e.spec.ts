import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { FornecedorModule } from 'src/infrastructure/http/Fornecedor/fornecedor.module';
import { FindFornecedorUseCase } from 'src/applications/useCase/fornecedor/Find';
import { Fornecedor } from 'src/core/domain/fornecedor/entity/Fornecedor';
import { CNPJ } from 'src/core/domain/objectValues/CNPJ';
import { Email } from 'src/core/domain/objectValues/Email';
import { right, left } from 'src/shared/either';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';

describe('GET /api/v1/fornecedor/:id (e2e)', () => {
  let app: NestExpressApplication;
  let findFornecedorUseCase: FindFornecedorUseCase;

  const fornecedor = Fornecedor.create({
    cnpj: CNPJ.create('12.345.678/0001-95'),
    email: Email.create('teste@empresa.com'),
    razaoSocial: 'Fornecedor Teste',
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [FornecedorModule],
    })
      .overrideProvider(FindFornecedorUseCase)
      .useValue({
        execute: jest.fn(),
      })
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() })
      .compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    await app.init();

    findFornecedorUseCase = moduleRef.get(FindFornecedorUseCase);
  });

  interface ErrorResponse {
    message: string;
  }

  it('deve retornar um fornecedor com sucesso', async () => {
    (findFornecedorUseCase.execute as jest.Mock).mockResolvedValue(
      right(fornecedor),
    );

    const res = await request(app.getHttpServer()).get(
      `/api/v1/fornecedor/${fornecedor.id.toString}`,
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Fornecedor encontrado com sucesso',
      fornecedor: {
        id: fornecedor.id.toString,
        razao_social: fornecedor.razaoSocial,
        cnpj: fornecedor.cnpj.formatted,
        email: fornecedor.email.toString,
        created: fornecedor.formattedCreatedAt,
      },
    });
  });

  it('deve retornar erro se o fornecedor não for encontrado', async () => {
    (findFornecedorUseCase.execute as jest.Mock).mockResolvedValue(
      left(new BadRequestException('Fornecedor não encontrado.')),
    );

    const res = await request(app.getHttpServer()).get(
      `/api/v1/fornecedor/uuid-nao-existente`,
    );

    const body = res.body as ErrorResponse;

    expect(res.status).toBe(400);
    expect(body.message).toBe('Fornecedor não encontrado.');
  });

  afterAll(async () => {
    await app.close();
  });
});
