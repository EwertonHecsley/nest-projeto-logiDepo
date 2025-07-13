import { Module } from '@nestjs/common';
import { CreateFornecedorUseCase } from 'src/applications/useCase/fornecedor/Create';
import { FornecedorRepository } from 'src/core/domain/fornecedor/repository/Fornecedor.repository';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CreateFornecedorController } from './controllers/Create.controller';
import { ListAllFornecedorUseCase } from 'src/applications/useCase/fornecedor/ListAll';
import { ListAllFornecedorController } from './controllers/ListAll.controller';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: CreateFornecedorUseCase,
      useFactory: (fornecedorRepository: FornecedorRepository) => {
        return new CreateFornecedorUseCase(fornecedorRepository);
      },
      inject: [FornecedorRepository],
    },
    {
      provide: ListAllFornecedorUseCase,
      useFactory: (fornecedorRepository: FornecedorRepository) => {
        return new ListAllFornecedorUseCase(fornecedorRepository);
      },
      inject: [FornecedorRepository],
    },
  ],
  controllers: [CreateFornecedorController, ListAllFornecedorController],
})
export class FornecedorModule {}
