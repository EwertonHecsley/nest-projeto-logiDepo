import { Product } from 'src/core/domain/product/entity/Product';

export class ProductPrismaPresenter {
  static toHTTP(entity: Product) {
    return {
      id: entity.id.toString,
      description: entity.description,
      price: entity.formattedPrice,
      quantity: entity.quantity,
      createdAt: entity.formattedCreatedAt,
    };
  }
}
