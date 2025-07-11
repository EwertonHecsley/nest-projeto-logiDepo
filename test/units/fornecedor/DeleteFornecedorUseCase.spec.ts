import { FornecedorRepository } from 'src/core/domain/fornecedor/repository/Fornecedor.repository';
import { Fornecedor } from 'src/core/domain/fornecedor/entity/Fornecedor';
import { CNPJ } from 'src/core/domain/objectValues/CNPJ';
import { Email } from 'src/core/domain/objectValues/Email';
import { NotFoundException } from '@nestjs/common';
import { DeleteFornecedorUseCase } from 'src/applications/useCase/fornecedor/Delete';

describe('DeleteFornecedorUseCase', () => {
  let useCase: DeleteFornecedorUseCase;
  let repository: jest.Mocked<FornecedorRepository>;

  const fornecedor = Fornecedor.create({
    cnpj: CNPJ.create('12.345.678/0001-95'),
    email: Email.create('fornecedor@email.com'),
    razaoSocial: 'Fornecedor LTDA',
  });

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<FornecedorRepository>;

    useCase = new DeleteFornecedorUseCase(repository);
  });

  it('deve deletar o fornecedor com sucesso', async () => {
    repository.findById.mockResolvedValue(fornecedor);
    repository.delete.mockResolvedValue();

    const result = await useCase.execute({ id: fornecedor.id.toString });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(true);
  });

  it('deve retornar NotFoundException se fornecedor não existir', async () => {
    repository.findById.mockResolvedValue(null);

    const result = await useCase.execute({ id: 'id-invalido' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundException);
    expect((result.value as NotFoundException).message).toBe(
      'Fornecedor com id id-invalido nao encontrado.',
    );
  });
});
