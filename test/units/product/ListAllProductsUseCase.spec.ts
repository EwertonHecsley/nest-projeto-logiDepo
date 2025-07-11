import { ListAllUseCase } from 'src/applications/useCase/product/List';
import { Product } from 'src/core/domain/product/entity/Product';
import { ProductRepository } from 'src/core/domain/product/repository/ProductRepository';

describe('ListAllUseCase', () => {
  let useCase: ListAllUseCase;
  let repository: jest.Mocked<ProductRepository>;

  const productsMock = [
    Product.create({ description: 'Produto 1', price: 10, quantity: 5 }),
    Product.create({ description: 'Produto 2', price: 20, quantity: 3 }),
  ];

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    useCase = new ListAllUseCase(repository);
  });

  it('deve retornar todos os produtos', async () => {
    repository.findAll.mockResolvedValue(productsMock);

    const result = await useCase.execute();

    expect(result).toEqual(productsMock);
  });
});
