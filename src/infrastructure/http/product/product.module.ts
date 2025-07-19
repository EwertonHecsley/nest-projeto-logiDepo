import { Module } from '@nestjs/common';
import { CreateProductUseCase } from 'src/applications/useCase/product/Create';
import { ProductRepository } from 'src/core/domain/product/repository/ProductRepository';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CreateProductController } from './controller/Create.controller';
import { FindProductUseCase } from 'src/applications/useCase/product/Find';
import { ListAllUseCase } from 'src/applications/useCase/product/List';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: CreateProductUseCase,
      useFactory: (productRepository: ProductRepository) => {
        return new CreateProductUseCase(productRepository);
      },
      inject: [ProductRepository],
    },
    {
      provide: FindProductUseCase,
      useFactory: (productRepository: ProductRepository) => {
        return new FindProductUseCase(productRepository);
      },
      inject: [ProductRepository],
    },
    {
      provide: ListAllUseCase,
      useFactory: (productRepository: ProductRepository) => {
        return new ListAllUseCase(productRepository);
      },
      inject: [ProductRepository],
    },
  ],
  controllers: [CreateProductController],
})
export class ProductModule {}
