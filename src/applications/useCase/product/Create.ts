import { BadRequestException } from '@nestjs/common';
import { Product } from 'src/core/domain/product/entity/Product';
import { ProductRepository } from 'src/core/domain/product/repository/ProductRepository';
import { Either, left, right } from 'src/shared/either';
import { CreateProductFactory } from './factory/ProductCreateFactory';

export type RequestProduct = {
  description: string;
  quantity: number;
  price: number;
};

export type ResponseProduct = Either<BadRequestException, Product>;

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute({
    description,
    price,
    quantity,
  }: RequestProduct): Promise<ResponseProduct> {
    const prodcutOrError = CreateProductFactory.create({
      description,
      price,
      quantity,
    });

    if (prodcutOrError.isLeft()) return left(prodcutOrError.value);
    const product = prodcutOrError.value;
    const result = await this.productRepository.create(product);

    return right(result);
  }
}
