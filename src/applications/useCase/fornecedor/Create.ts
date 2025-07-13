import { BadRequestException } from '@nestjs/common';
import { Fornecedor } from 'src/core/domain/fornecedor/entity/Fornecedor';
import { FornecedorRepository } from 'src/core/domain/fornecedor/repository/Fornecedor.repository';
import { Either, left, right } from 'src/shared/either';
import { FornecedorCreateFactory } from './factory/FornecedorCreateFactory';

type RequestCreate = {
  cnpj: string;
  razaoSocial: string;
  email: string;
};

type ResponseCreate = Either<BadRequestException, Fornecedor>;

export class CreateFornecedorUseCase {
  constructor(private readonly fornecedorRepository: FornecedorRepository) {}

  async execute(data: RequestCreate): Promise<ResponseCreate> {
    const { cnpj, razaoSocial, email } = data;

    const cnpjexists = await this.fornecedorRepository.findByCnpj(cnpj);
    if (cnpjexists) {
      return left(new BadRequestException('CNPJ ja cadastrado.'));
    }

    const emailExists = await this.fornecedorRepository.findByEmail(email);
    if (emailExists)
      return left(new BadRequestException('Email ja cadastrado.'));

    const fornecedorOrError = FornecedorCreateFactory.create({
      razaoSocial,
      cnpj,
      email,
    });
    if (fornecedorOrError.isLeft()) return left(fornecedorOrError.value);

    const fornecedor = fornecedorOrError.value;
    const result = await this.fornecedorRepository.create(fornecedor);

    return right(result);
  }
}
