import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { FornecedorRepository } from 'src/core/domain/fornecedor/repository/Fornecedor.repository';
import { FornecedorPrismaRepository } from '../repositories/FornecedorRepository';
import { ProductRepository } from 'src/core/domain/product/repository/ProductRepository';
import { ProductPrismaRepository } from '../repositories/ProductRepository';

@Module({
  providers: [
    PrismaService,
    {
      provide: FornecedorRepository,
      useClass: FornecedorPrismaRepository,
    },
    {
      provide: ProductRepository,
      useClass: ProductPrismaRepository,
    },
  ],
  exports: [PrismaService, FornecedorRepository, ProductRepository],
})
export class PrismaModule {}
