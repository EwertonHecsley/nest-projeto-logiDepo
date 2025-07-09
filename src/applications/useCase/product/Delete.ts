import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductRepository } from 'src/core/domain/product/repository/ProductRepository';
import { Either, left, right } from 'src/shared/either';

type RequestProduct = {
  id: string;
};

type ResponseProduct = Either<NotFoundException | BadRequestException, boolean>;

export class DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute({ id }: RequestProduct): Promise<ResponseProduct> {
    if (!id) return left(new BadRequestException('ID invalido ou ausente.'));
    const product = await this.productRepository.findById(id);
    if (!product) return left(new NotFoundException('Produto não encontrado.'));
    await this.productRepository.delete(id);
    return right(true);
  }
}
