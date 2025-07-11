import { FindProductUseCase } from 'src/applications/useCase/product/Find';
import { Product } from 'src/core/domain/product/entity/Product';
import { ProductRepository } from 'src/core/domain/product/repository/ProductRepository';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('FindProductUseCase', () => {
  let useCase: FindProductUseCase;
  let repository: jest.Mocked<ProductRepository>;

  const fakeProduct = Product.create({
    description: 'Produto Teste',
    price: 100,
    quantity: 5,
  });

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    useCase = new FindProductUseCase(repository);
  });

  it('deve retornar um produto válido se encontrado', async () => {
    repository.findById.mockResolvedValue(fakeProduct);

    const result = await useCase.execute({ id: 'valid-id' });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBeInstanceOf(Product);
  });

  it('deve retornar erro se o id for vazio', async () => {
    const result = await useCase.execute({ id: '' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestException);
    expect((result.value as BadRequestException).message).toBe(
      'ID invalido ou ausente.',
    );
  });

  it('deve retornar erro se o produto não for encontrado', async () => {
    repository.findById.mockResolvedValue(null);

    const result = await useCase.execute({ id: 'nonexistent-id' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundException);
    expect((result.value as NotFoundException).message).toBe(
      'Produto nao encontrado.',
    );
  });
});
