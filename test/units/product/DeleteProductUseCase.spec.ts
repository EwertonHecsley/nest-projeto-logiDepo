import { DeleteProductUseCase } from 'src/applications/useCase/product/Delete';
import { ProductRepository } from 'src/core/domain/product/repository/ProductRepository';
import { Product } from 'src/core/domain/product/entity/Product';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;
  let repository: jest.Mocked<ProductRepository>;

  const fakeProduct = Product.create({
    description: 'Produto para deletar',
    price: 50,
    quantity: 5,
  });

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    useCase = new DeleteProductUseCase(repository);
  });

  it('deve deletar produto com sucesso', async () => {
    repository.findById.mockResolvedValue(fakeProduct);
    repository.delete.mockResolvedValue(undefined);

    const result = await useCase.execute({ id: 'valid-id' });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(true);
  });

  it('deve retornar erro se id for vazio', async () => {
    const result = await useCase.execute({ id: '' });

    expect(result.isLeft()).toBe(true);
    expect((result.value as BadRequestException).message).toBe(
      'ID invalido ou ausente.',
    );
  });

  it('deve retornar erro se produto não for encontrado', async () => {
    repository.findById.mockResolvedValue(null);

    const result = await useCase.execute({ id: 'nonexistent-id' });

    expect(result.isLeft()).toBe(true);
    expect((result.value as NotFoundException).message).toBe(
      'Produto não encontrado.',
    );
  });
});
