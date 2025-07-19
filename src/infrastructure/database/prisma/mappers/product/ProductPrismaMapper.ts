import { Product as ProductDatabase } from '@prisma/client';
import { Product } from 'src/core/domain/product/entity/Product';
import { Identity } from 'src/core/generics/Identity';

export class ProductPrismaMapper {
  static toDatabase(entity: Product): any {
    return {
      id: entity.id.toString,
      price: entity.price,
      description: entity.description,
      createdAt: entity.createdAt,
    };
  }

  static toDomain(entityDatabase: ProductDatabase): Product {
    return Product.create(
      {
        description: entityDatabase.descricao,
        price: entityDatabase.price,
        quantity: entityDatabase.quantity,
        createdAt: entityDatabase.createdAt,
      },
      new Identity(entityDatabase.id),
    );
  }
}
