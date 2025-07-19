import { InternalServerErrorException } from '@nestjs/common';
import {
  FindAllParams,
  PaginatedResponse,
} from 'src/core/domain/fornecedor/repository/Fornecedor.repository';
import { Product } from 'src/core/domain/product/entity/Product';
import { ProductRepository } from 'src/core/domain/product/repository/ProductRepository';
import { Either, left, right } from 'src/shared/either';

type ResponseClient = Either<
  InternalServerErrorException,
  PaginatedResponse<Product>
>;

export class ListAllUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(params: FindAllParams): Promise<ResponseClient> {
    try {
      const result = await this.productRepository.findAll(params);
      return right(result);
    } catch (error: any) {
      console.error('Error fetching Products:', error);
      return left(new InternalServerErrorException('Failed to list Products.'));
    }
  }
}
