import { UpdateProductUseCase } from 'src/applications/useCase/product/Update';
import { ProductRepository } from 'src/core/domain/product/repository/ProductRepository';
import { Product } from 'src/core/domain/product/entity/Product';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UpdateProductUseCase', () => {
  let useCase: UpdateProductUseCase;
  let repository: jest.Mocked<ProductRepository>;

  const existingProduct = Product.create({
    description: 'Produto Existente',
    price: 100,
    quantity: 10,
  });

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    useCase = new UpdateProductUseCase(repository);
  });

  it('deve atualizar um produto com sucesso', async () => {
    repository.findById.mockResolvedValue(existingProduct);
    repository.save.mockResolvedValue(undefined);

    const result = await useCase.execute({
      id: 'valid-id',
      description: 'Produto Atualizado',
      price: 150,
      quantity: 20,
    });

    expect(result.isRight()).toBe(true);
    expect(repository.save).toHaveBeenCalledWith(existingProduct);
    expect(existingProduct.description).toBe('Produto Atualizado');
    expect(existingProduct.price).toBe(150);
    expect(existingProduct.quantity).toBe(20);
  });

  it('deve retornar erro se produto não existir', async () => {
    repository.findById.mockResolvedValue(null);

    const result = await useCase.execute({
      id: 'nonexistent-id',
      description: 'Teste',
    });

    expect(result.isLeft()).toBe(true);
    expect((result.value as NotFoundException).message).toBe(
      'Produto nao encontrado.',
    );
  });

  it('deve retornar erro se descrição for vazia', async () => {
    repository.findById.mockResolvedValue(existingProduct);

    const result = await useCase.execute({
      id: 'valid-id',
      description: '    ',
    });

    expect(result.isLeft()).toBe(true);
    expect((result.value as BadRequestException).message).toBe(
      'Descrição não pode ser vazia.',
    );
  });

  it('deve retornar erro se preço for negativo', async () => {
    repository.findById.mockResolvedValue(existingProduct);

    const result = await useCase.execute({
      id: 'valid-id',
      price: -10,
    });

    expect(result.isLeft()).toBe(true);
    expect((result.value as BadRequestException).message).toBe(
      'Preço não pode ser negativo.',
    );
  });

  it('deve retornar erro se quantidade for negativa', async () => {
    repository.findById.mockResolvedValue(existingProduct);

    const result = await useCase.execute({
      id: 'valid-id',
      quantity: -5,
    });

    expect(result.isLeft()).toBe(true);
    expect((result.value as BadRequestException).message).toBe(
      'Quantidade não pode ser negativa.',
    );
  });
});
