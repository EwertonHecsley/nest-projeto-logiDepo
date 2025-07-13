import { ListAllFornecedorUseCase } from 'src/applications/useCase/fornecedor/ListAll';
import { Fornecedor } from 'src/core/domain/fornecedor/entity/Fornecedor';
import { FornecedorRepository } from 'src/core/domain/fornecedor/repository/Fornecedor.repository';
import { CNPJ } from 'src/core/domain/objectValues/CNPJ';
import { Email } from 'src/core/domain/objectValues/Email';
import { PaginatedResponse } from 'src/core/domain/fornecedor/repository/Fornecedor.repository';

describe('ListAllFornecedorUseCase', () => {
  let useCase: ListAllFornecedorUseCase;
  let repository: jest.Mocked<FornecedorRepository>;

  const fornecedor = Fornecedor.create({
    cnpj: CNPJ.create('12.345.678/0001-95'),
    email: Email.create('teste@empresa.com'),
    razaoSocial: 'Fornecedor 1',
  });

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<FornecedorRepository>;

    useCase = new ListAllFornecedorUseCase(repository);
  });

  it('deve retornar uma lista paginada de fornecedores', async () => {
    const page = 1;
    const limit = 10;

    const paginatedResponse: PaginatedResponse<Fornecedor> = {
      data: [fornecedor],
      total: 1,
      page,
      limit,
    };

    repository.findAll.mockResolvedValue(paginatedResponse);

    const result = await useCase.execute({ page, limit });

    expect(result.isRight()).toBe(true);

    const value = result.value as PaginatedResponse<Fornecedor>;
    expect(value.data).toHaveLength(1);
    expect(value.data[0]).toBeInstanceOf(Fornecedor);
    expect(value.total).toBe(1);
    expect(value.page).toBe(page);
    expect(value.limit).toBe(limit);
  });

  it('deve retornar uma lista paginada vazia', async () => {
    const page = 1;
    const limit = 10;

    const paginatedResponse: PaginatedResponse<Fornecedor> = {
      data: [],
      total: 0,
      page,
      limit,
    };

    repository.findAll.mockResolvedValue(paginatedResponse);

    const result = await useCase.execute({ page, limit });

    expect(result.isRight()).toBe(true);

    const value = result.value as PaginatedResponse<Fornecedor>;
    expect(value.data).toEqual([]);
    expect(value.total).toBe(0);
    expect(value.page).toBe(page);
    expect(value.limit).toBe(limit);
  });
});
