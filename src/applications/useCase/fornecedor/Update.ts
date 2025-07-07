import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FornecedorRepository } from 'src/core/domain/fornecedor/repository/Fornecedor.repository';
import { Either, left, right } from 'src/shared/either';
import { FornecedorUpdateFactory } from './factory/FornecedorUpdateFactory';

type Request = {
  id: string;
  razaoSocial?: string;
  cnpj?: string;
  email?: string;
};

type Response = Either<BadRequestException | NotFoundException, boolean>;

export class UpdateFornecedorUseCase {
  constructor(private readonly fornecedorRepository: FornecedorRepository) {}

  async execute(data: Request): Promise<Response> {
    const fornecedor = await this.fornecedorRepository.findById(data.id);
    if (!fornecedor) {
      return left(
        new NotFoundException(`Fornecedor com id ${data.id} não encontrado.`),
      );
    }

    const updateOrError = await FornecedorUpdateFactory.validateAndCreate(
      data,
      this.fornecedorRepository,
    );

    if (updateOrError.isLeft()) {
      return left(updateOrError.value);
    }

    const { newCnpj, newEmail, newRazaoSocial } = updateOrError.value;

    if (newCnpj) fornecedor.updateCnpj(newCnpj);
    if (newEmail) fornecedor.updateEmail(newEmail);
    if (newRazaoSocial) fornecedor.updateRazaoSocial(newRazaoSocial);

    await this.fornecedorRepository.save(fornecedor);

    return right(true);
  }
}
