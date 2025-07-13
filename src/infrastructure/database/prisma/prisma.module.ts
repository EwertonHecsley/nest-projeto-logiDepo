import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { FornecedorRepository } from 'src/core/domain/fornecedor/repository/Fornecedor.repository';
import { FornecedorPrismaRepository } from '../repositories/FornecedorRepository';

@Module({
  providers: [
    PrismaService,
    {
      provide: FornecedorRepository,
      useClass: FornecedorPrismaRepository,
    },
  ],
  exports: [PrismaService, FornecedorRepository],
})
export class PrismaModule {}
