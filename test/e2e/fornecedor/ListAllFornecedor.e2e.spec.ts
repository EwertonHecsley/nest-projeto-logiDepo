import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { FornecedorModule } from 'src/infrastructure/http/Fornecedor/fornecedor.module';
import { ListAllFornecedorUseCase } from 'src/applications/useCase/fornecedor/ListAll';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { Fornecedor } from 'src/core/domain/fornecedor/entity/Fornecedor';
import { CNPJ } from 'src/core/domain/objectValues/CNPJ';
import { Email } from 'src/core/domain/objectValues/Email';
import { right } from 'src/shared/either';

describe('GET /fornecedor (e2e)', () => {
  let app: NestExpressApplication;
  let listAllFornecedorUseCase: ListAllFornecedorUseCase;

  const fornecedor = Fornecedor.create({
    cnpj: CNPJ.create('12.345.678/0001-95'),
    email: Email.create('teste@empresa.com'),
    razaoSocial: 'Fornecedor Teste',
  });

  const paginatedResponse = {
    data: [fornecedor],
    total: 1,
    page: 1,
    limit: 10,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [FornecedorModule],
    })
      .overrideProvider(ListAllFornecedorUseCase)
      .useValue({
        execute: jest.fn(),
      })
      .overrideProvider(PrismaService)
      .useValue({ $connect: jest.fn() })
      .compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    await app.init();

    listAllFornecedorUseCase = moduleRef.get(ListAllFornecedorUseCase);
  });

  it('deve retornar uma lista paginada de fornecedores com sucesso', async () => {
    (listAllFornecedorUseCase.execute as jest.Mock).mockResolvedValue(
      right(paginatedResponse),
    );

    const res = await request(app.getHttpServer())
      .get('/fornecedor?page=1&limit=10')
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Fornecedores listados com sucesso.',
      data: [
        {
          id: fornecedor.id.toString,
          razao_social: fornecedor.razaoSocial,
          cnpj: fornecedor.cnpj.formatted,
          email: fornecedor.email.toString,
          created: fornecedor.formattedCreatedAt,
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
