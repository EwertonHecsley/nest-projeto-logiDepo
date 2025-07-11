import { CreateProductUseCase } from 'src/applications/useCase/product/Create';
import { Product } from 'src/core/domain/product/entity/Product';
import { ProductRepository } from 'src/core/domain/product/repository/ProductRepository';
import { BadRequestException } from '@nestjs/common';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let repository: jest.Mocked<ProductRepository>;

  const validRequest = {
    description: 'Produto de teste',
    price: 50,
    quantity: 10,
  };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    useCase = new CreateProductUseCase(repository);
  });

  it('deve criar um produto com sucesso', async () => {
    repository.create.mockImplementation(async (product) => product);

    const result = await useCase.execute(validRequest);

    expect(result.isRight()).toBe(true);
    expect(result.value).toBeInstanceOf(Product);
    expect((result.value as Product).description).toBe(
      validRequest.description,
    );
  });

  it('deve retornar erro se os dados forem inválidos (campos faltando)', async () => {
    const result = await useCase.execute({
      description: '',
      price: 10,
      quantity: 5,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestException);
    expect((result.value as BadRequestException).message).toBe(
      'Descricao, preco e quantidade são obrigatorios.',
    );
  });

  it('deve retornar erro se preço for negativo', async () => {
    const result = await useCase.execute({
      ...validRequest,
      price: -1,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestException);
    expect((result.value as BadRequestException).message).toBe(
      'Preco e quantidade não podem ser negativas.',
    );
  });

  it('deve retornar erro se quantidade for negativa', async () => {
    const result = await useCase.execute({
      ...validRequest,
      quantity: -5,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestException);
    expect((result.value as BadRequestException).message).toBe(
      'Preco e quantidade não podem ser negativas.',
    );
  });
});
