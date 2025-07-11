import { BadRequestException } from '@nestjs/common';
import { CreateFornecedorUseCase } from 'src/applications/useCase/fornecedor/Create';
import { Fornecedor } from 'src/core/domain/fornecedor/entity/Fornecedor';
import { FornecedorRepository } from 'src/core/domain/fornecedor/repository/Fornecedor.repository';
import { CNPJ } from 'src/core/domain/objectValues/CNPJ';
import { Email } from 'src/core/domain/objectValues/Email';

describe('CreateFornecedorUseCase', () => {
  let useCase: CreateFornecedorUseCase;
  let repository: jest.Mocked<FornecedorRepository>;

  const requestData = {
    cnpj: '12.345.678/0001-95',
    email: 'teste@exemplo.com',
    razaoSocial: 'Empresa Teste',
  };

  beforeEach(() => {
    repository = {
      findByCnpj: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<FornecedorRepository>;

    useCase = new CreateFornecedorUseCase(repository);
  });

  it('deve criar um fornecedor com sucesso', async () => {
    repository.findByCnpj.mockResolvedValue(null);
    repository.findByEmail.mockResolvedValue(null);
    repository.create.mockImplementation(async (fornecedor) => fornecedor);

    const result = await useCase.execute(requestData);

    expect(result.isRight()).toBe(true);
    expect(result.value).toBeInstanceOf(Fornecedor);
  });

  it('deve retornar erro se CNPJ já estiver cadastrado', async () => {
    const fakeFornecedor = Fornecedor.create({
      cnpj: CNPJ.create(requestData.cnpj),
      email: Email.create(requestData.email),
      razaoSocial: requestData.razaoSocial,
    });

    repository.findByCnpj.mockResolvedValue(fakeFornecedor);

    const result = await useCase.execute(requestData);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestException);
  });

  it('deve retornar erro se email já estiver cadastrado', async () => {
    const fakeFornecedor = Fornecedor.create({
      cnpj: CNPJ.create(requestData.cnpj),
      email: Email.create(requestData.email),
      razaoSocial: requestData.razaoSocial,
    });

    repository.findByCnpj.mockResolvedValue(null);
    repository.findByEmail.mockResolvedValue(fakeFornecedor);

    const result = await useCase.execute(requestData);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestException);
  });

  it('deve retornar erro se dados forem inválidos no factory', async () => {
    const invalidRequest = {
      ...requestData,
      razaoSocial: '',
    };

    const result = await useCase.execute(invalidRequest);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestException);
  });
});
