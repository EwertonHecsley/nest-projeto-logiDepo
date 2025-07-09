import { Product } from '../entity/Product';

export abstract class ProductRepository {
  abstract create(entity: Product): Promise<Product>;
  abstract findById(id: string): Promise<Product | null>;
  abstract findAll(): Promise<Product[]>;
  abstract save(product: Product): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
