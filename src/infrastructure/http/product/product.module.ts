import { Module } from '@nestjs/common';
import { CreateProductUseCase } from 'src/applications/useCase/product/Create';
import { ProductRepository } from 'src/core/domain/product/repository/ProductRepository';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

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
  ],
  controllers: [],
})
export class ProductModule {}
