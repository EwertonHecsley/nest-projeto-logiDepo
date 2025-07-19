import { BadRequestException } from '@nestjs/common';
import { Entity } from 'src/core/generics/Entity';
import { Identity } from 'src/core/generics/Identity';

type ProductProps = {
  description: string;
  quantity: number;
  price: number;
  createdAt?: Date;
};

export class Product extends Entity<ProductProps> {
  private constructor(props: ProductProps, id?: Identity) {
    super(props, id);
  }

  static create(props: ProductProps, id?: Identity): Product {
    return new Product(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }

  get description(): string {
    return this.attributes.description;
  }

  get quantity(): number {
    return this.attributes.quantity;
  }

  get price(): number {
    return this.attributes.price;
  }

  get createdAt(): Date {
    return this.attributes.createdAt!;
  }

  get formattedCreatedAt(): string {
    return this.createdAt.toLocaleDateString('pt-br', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  get formattedPrice(): string {
    return this.price.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  updateDescription(description: string): void {
    if (!description || description.trim() === '') {
      throw new BadRequestException('Descricao do produto nao pode ser vazia.');
    }
    this.attributes.description = description;
  }

  updateQuantity(quantity: number): void {
    if (quantity < 0) {
      throw new BadRequestException('Quantidade nao pode ser negativa.');
    }
    this.attributes.quantity = quantity;
  }

  updatePrice(price: number): void {
    if (price < 0) {
      throw new BadRequestException('Preco nao pode ser negativo.');
    }
    this.attributes.price = price;
  }
}
