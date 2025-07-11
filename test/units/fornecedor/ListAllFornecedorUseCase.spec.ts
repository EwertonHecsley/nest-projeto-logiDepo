import { ListAllFornecedorUseCase } from 'src/applications/useCase/fornecedor/ListAll';
import { Fornecedor } from 'src/core/domain/fornecedor/entity/Fornecedor';
import { FornecedorRepository } from 'src/core/domain/fornecedor/repository/Fornecedor.repository';
import { CNPJ } from 'src/core/domain/objectValues/CNPJ';
import { Email } from 'src/core/domain/objectValues/Email';

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

  it('deve retornar uma lista de fornecedores', async () => {
    repository.findAll.mockResolvedValue([fornecedor]);

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Fornecedor);
    expect(result[0].razaoSocial).toBe('Fornecedor 1');
  });

  it('deve retornar uma lista vazia se nenhum fornecedor existir', async () => {
    repository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
