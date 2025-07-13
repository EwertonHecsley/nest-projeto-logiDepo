import { InternalServerErrorException } from '@nestjs/common';
import { Fornecedor } from 'src/core/domain/fornecedor/entity/Fornecedor';
import {
  FindAllParams,
  FornecedorRepository,
  PaginatedResponse,
} from 'src/core/domain/fornecedor/repository/Fornecedor.repository';
import { Either, left, right } from 'src/shared/either';

type ResponseClient = Either<
  InternalServerErrorException,
  PaginatedResponse<Fornecedor>
>;

export class ListAllFornecedorUseCase {
  constructor(private readonly fornecedorRepository: FornecedorRepository) {}

  async execute(params: FindAllParams): Promise<ResponseClient> {
    try {
      const result = await this.fornecedorRepository.findAll(params);
      return right(result);
    } catch (error: any) {
      console.error('Error fetching Fornecedores:', error);
      return left(
        new InternalServerErrorException('Failed to list Fornecedor.'),
      );
    }
  }
}
