import { NotFoundException } from '@nestjs/common';
import { FindFornecedorUseCase } from 'src/applications/useCase/fornecedor/Find';
import { Fornecedor } from 'src/core/domain/fornecedor/entity/Fornecedor';
import { FornecedorRepository } from 'src/core/domain/fornecedor/repository/Fornecedor.repository';
import { CNPJ } from 'src/core/domain/objectValues/CNPJ';
import { Email } from 'src/core/domain/objectValues/Email';

describe('FindFornecedorUseCase', () => {
  let useCase: FindFornecedorUseCase;
  let repository: jest.Mocked<FornecedorRepository>;

  const fakeFornecedor = Fornecedor.create({
    cnpj: CNPJ.create('12.345.678/0001-95'),
    email: Email.create('teste@exemplo.com'),
    razaoSocial: 'Fornecedor Ltda',
  });

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<FornecedorRepository>;

    useCase = new FindFornecedorUseCase(repository);
  });

  it('deve retornar o fornecedor quando encontrado', async () => {
    repository.findById.mockResolvedValue(fakeFornecedor);

    const result = await useCase.execute({ id: fakeFornecedor.id.toString });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBeInstanceOf(Fornecedor);
  });

  it('deve retornar NotFoundException quando não encontrar o fornecedor', async () => {
    repository.findById.mockResolvedValue(null);

    const result = await useCase.execute({ id: 'id-nao-existente' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundException);
    expect((result.value as NotFoundException).message).toBe(
      'Fornecedor com id id-nao-existente nao encontrado.',
    );
  });
});
