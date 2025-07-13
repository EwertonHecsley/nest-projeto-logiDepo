import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { FornecedorModule } from 'src/infrastructure/http/Fornecedor/fornecedor.module';
import { CreateFornecedorUseCase } from 'src/applications/useCase/fornecedor/Create';
import { Fornecedor } from 'src/core/domain/fornecedor/entity/Fornecedor';
import { CNPJ } from 'src/core/domain/objectValues/CNPJ';
import { Email } from 'src/core/domain/objectValues/Email';
import { right, left } from 'src/shared/either';
import { BadRequestException } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

describe('POST /fornecedor (e2e)', () => {
  let app: NestExpressApplication;
  let createFornecedorUseCase: CreateFornecedorUseCase;

  const mockFornecedor = Fornecedor.create({
    cnpj: CNPJ.create('12.345.678/0001-95'),
    email: Email.create('teste@empresa.com'),
    razaoSocial: 'Fornecedor Teste',
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [FornecedorModule],
    })
      .overrideProvider(CreateFornecedorUseCase)
      .useValue({
        execute: jest.fn(),
      })
      .compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    await app.init();

    createFornecedorUseCase = moduleRef.get(CreateFornecedorUseCase);
  });

  interface ErrorResponse {
    message: string;
  }

  it('deve criar um fornecedor com sucesso', async () => {
    (createFornecedorUseCase.execute as jest.Mock).mockResolvedValue(
      right(mockFornecedor),
    );

    const res = await request(app.getHttpServer()).post('/fornecedor').send({
      cnpj: '12.345.678/0001-95',
      email: 'teste@empresa.com',
      razaoSocial: 'Fornecedor Teste',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      message: 'Fornecedor criado com sucesso.',
      fornecedor: {
        id: mockFornecedor.id.toString,
        razao_social: mockFornecedor.razaoSocial,
        cnpj: mockFornecedor.cnpj.formatted,
        email: mockFornecedor.email.toString,
        created: mockFornecedor.formattedCreatedAt,
      },
    });
  });

  it('deve retornar erro se CNPJ já estiver cadastrado', async () => {
    (createFornecedorUseCase.execute as jest.Mock).mockResolvedValue(
      left(new BadRequestException('CNPJ ja cadastrado.')),
    );

    const res = await request(app.getHttpServer()).post('/fornecedor').send({
      cnpj: '12.345.678/0001-95',
      email: 'teste@empresa.com',
      razaoSocial: 'Fornecedor Teste',
    });

    const body = res.body as ErrorResponse;

    expect(res.statusCode).toBe(400);
    expect(body.message).toBe('CNPJ ja cadastrado.');
  });

  afterAll(async () => {
    await app.close();
  });
});
