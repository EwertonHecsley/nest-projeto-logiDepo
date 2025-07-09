import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Product } from 'src/core/domain/product/entity/Product';
import { ProductRepository } from 'src/core/domain/product/repository/ProductRepository';
import { Either, left, right } from 'src/shared/either';

type Request = {
  id: string;
};

type Response = Either<NotFoundException | BadRequestException, Product>;

export class FindProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute({ id }: Request): Promise<Response> {
    if (!id) return left(new BadRequestException('ID invalido ou ausente.'));

    const product = await this.productRepository.findById(id);
    if (!product) return left(new NotFoundException('Produto nao encontrado.'));

    return right(product);
  }
}
