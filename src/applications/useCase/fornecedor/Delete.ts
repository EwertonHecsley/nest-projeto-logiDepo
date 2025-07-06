import { NotFoundException } from '@nestjs/common';
import { FornecedorRepository } from 'src/core/domain/fornecedor/repository/Fornecedor.repository';
import { Either, left, right } from 'src/shared/either';

type Request = {
  id: string;
};

type Response = Either<NotFoundException, boolean>;

export class DeleteFornecedorUseCase {
  constructor(private readonly fornecedorRepository: FornecedorRepository) {}

  async execute({ id }: Request): Promise<Response> {
    const fornecedor = await this.fornecedorRepository.findById(id);
    if (!fornecedor) {
      return left(
        new NotFoundException(`Fornecedor com id ${id} nao encontrado.`),
      );
    }

    await this.fornecedorRepository.delete(id);

    return right(true);
  }
}
