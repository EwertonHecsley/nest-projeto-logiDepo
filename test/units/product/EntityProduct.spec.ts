import { Product } from 'src/core/domain/product/entity/Product';
import { BadRequestException } from '@nestjs/common';

describe('Product Entity', () => {
  const validData = {
    description: 'Produto A',
    quantity: 10,
    price: 29.9,
  };

  it('deve criar um produto válido', () => {
    const product = Product.create(validData);

    expect(product).toBeInstanceOf(Product);
    expect(product.description).toBe(validData.description);
    expect(product.quantity).toBe(validData.quantity);
    expect(product.price).toBe(validData.price);
    expect(product.createdAt).toBeInstanceOf(Date);
  });

  it('deve atualizar a descrição com sucesso', () => {
    const product = Product.create(validData);

    product.updateDescription('Produto Atualizado');
    expect(product.description).toBe('Produto Atualizado');
  });

  it('deve lançar erro ao atualizar descrição vazia', () => {
    const product = Product.create(validData);

    expect(() => product.updateDescription('')).toThrow(BadRequestException);
  });

  it('deve atualizar a quantidade com sucesso', () => {
    const product = Product.create(validData);

    product.updateQuantity(20);
    expect(product.quantity).toBe(20);
  });

  it('deve lançar erro ao atualizar quantidade para valor negativo', () => {
    const product = Product.create(validData);

    expect(() => product.updateQuantity(-5)).toThrow(BadRequestException);
  });

  it('deve atualizar o preço com sucesso', () => {
    const product = Product.create(validData);

    product.updatePrice(50.5);
    expect(product.price).toBe(50.5);
  });

  it('deve lançar erro ao atualizar preço para valor negativo', () => {
    const product = Product.create(validData);

    expect(() => product.updatePrice(-10)).toThrow(BadRequestException);
  });
});
