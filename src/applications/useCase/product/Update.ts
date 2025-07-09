import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductRepository } from 'src/core/domain/product/repository/ProductRepository';
import { Either, left, right } from 'src/shared/either';
import { UpdateProductFactory } from './factory/ProductUpdateFactory';

export type RequestProduct = {
  id: string;
  description?: string;
  quantity?: number;
  price?: number;
};

export type ResponseProduct = Either<
  NotFoundException | BadRequestException,
  boolean
>;

export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(data: RequestProduct): Promise<ResponseProduct> {
    const { id } = data;
    const productExists = await this.productRepository.findById(id);
    if (!productExists)
      return left(new NotFoundException('Produto nao encontrado.'));

    const updateOrError = UpdateProductFactory.validateAndCreate({ ...data });
    if (updateOrError.isLeft()) return left(updateOrError.value);

    const { newDescription, newPrice, newQuantity } = updateOrError.value;

    if (newDescription) productExists.updateDescription(newDescription);
    if (newPrice !== undefined) productExists.updatePrice(newPrice);
    if (newQuantity !== undefined) productExists.updateQuantity(newQuantity);

    await this.productRepository.save(productExists);

    return right(true);
  }
}
