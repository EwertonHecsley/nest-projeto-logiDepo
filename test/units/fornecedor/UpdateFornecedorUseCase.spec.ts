import { FornecedorRepository } from 'src/core/domain/fornecedor/repository/Fornecedor.repository';
import { Fornecedor } from 'src/core/domain/fornecedor/entity/Fornecedor';
import { CNPJ } from 'src/core/domain/objectValues/CNPJ';
import { Email } from 'src/core/domain/objectValues/Email';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { left, right } from 'src/shared/either';
import { UpdateFornecedorUseCase } from 'src/applications/useCase/fornecedor/Update';
import { FornecedorUpdateFactory } from 'src/applications/useCase/fornecedor/factory/FornecedorUpdateFactory';

jest.mock(
  'src/applications/useCase/fornecedor/factory/FornecedorUpdateFactory',
);

describe('UpdateFornecedorUseCase', () => {
  let useCase: UpdateFornecedorUseCase;
  let repository: jest.Mocked<FornecedorRepository>;

  const fornecedor = Fornecedor.create({
    cnpj: CNPJ.create('12.345.678/0001-95'),
    email: Email.create('original@email.com'),
    razaoSocial: 'Original Ltda',
  });

  const requestData = {
    id: fornecedor.id.toString,
    cnpj: '98.765.432/0001-10',
    email: 'atualizado@email.com',
    razaoSocial: 'Atualizado SA',
  };

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<FornecedorRepository>;

    useCase = new UpdateFornecedorUseCase(repository);
  });

  it('deve atualizar o fornecedor com sucesso', async () => {
    repository.findById.mockResolvedValue(fornecedor);
    (FornecedorUpdateFactory.validateAndCreate as jest.Mock).mockResolvedValue(
      right({
        newCnpj: CNPJ.create(requestData.cnpj),
        newEmail: Email.create(requestData.email),
        newRazaoSocial: requestData.razaoSocial,
      }),
    );

    const result = await useCase.execute(requestData);

    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(true);
  });

  it('deve retornar NotFoundException se fornecedor não existir', async () => {
    repository.findById.mockResolvedValue(null);

    const result = await useCase.execute(requestData);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundException);
    expect((result.value as NotFoundException).message).toBe(
      `Fornecedor com id ${requestData.id} não encontrado.`,
    );
  });

  it('deve retornar erro se factory falhar', async () => {
    repository.findById.mockResolvedValue(fornecedor);
    (FornecedorUpdateFactory.validateAndCreate as jest.Mock).mockResolvedValue(
      left(new BadRequestException('Dados inválidos')),
    );

    const result = await useCase.execute(requestData);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestException);
    expect((result.value as BadRequestException).message).toBe(
      'Dados inválidos',
    );
  });
});
