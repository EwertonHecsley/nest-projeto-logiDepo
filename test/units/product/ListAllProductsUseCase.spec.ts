import { ListAllUseCase } from 'src/applications/useCase/product/List';
import { PaginatedResponse } from 'src/core/domain/fornecedor/repository/Fornecedor.repository';
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
    const page = 1;
    const limit = 10;

    const paginatedResponse: PaginatedResponse<Product> = {
      data: productsMock,
      total: 1,
      page,
      limit,
    };

    repository.findAll.mockResolvedValue(paginatedResponse);

    const result = await useCase.execute({ page, limit });

    expect(result.isRight()).toBe(true);
    const value = result.value as PaginatedResponse<Product>;
    expect(value.data).toHaveLength(1);
    expect(value.data[0]).toBeInstanceOf(Product);
    expect(value.total).toBe(1);
    expect(value.page).toBe(page);
    expect(value.limit).toBe(limit);
  });
});
