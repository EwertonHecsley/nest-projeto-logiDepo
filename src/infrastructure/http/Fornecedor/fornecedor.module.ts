import { Module } from '@nestjs/common';
import { CreateFornecedorUseCase } from 'src/applications/useCase/fornecedor/Create';
import { FornecedorRepository } from 'src/core/domain/fornecedor/repository/Fornecedor.repository';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { CreateFornecedorController } from './controllers/Create.controller';
import { ListAllFornecedorUseCase } from 'src/applications/useCase/fornecedor/ListAll';
import { ListAllFornecedorController } from './controllers/ListAll.controller';
import { DeleteFornecedorUseCase } from 'src/applications/useCase/fornecedor/Delete';
import { DeleteFornecedorController } from './controllers/Delete.controller';
import { FindFornecedorUseCase } from 'src/applications/useCase/fornecedor/Find';
import { FindFornecedorController } from './controllers/Find.controller';

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
    {
      provide: DeleteFornecedorUseCase,
      useFactory: (fornecedorRepository: FornecedorRepository) => {
        return new DeleteFornecedorUseCase(fornecedorRepository);
      },
      inject: [FornecedorRepository],
    },
    {
      provide: FindFornecedorUseCase,
      useFactory: (fornecedorRepository: FornecedorRepository) => {
        return new FindFornecedorUseCase(fornecedorRepository);
      },
      inject: [FornecedorRepository],
    },
  ],
  controllers: [
    CreateFornecedorController,
    ListAllFornecedorController,
    DeleteFornecedorController,
    FindFornecedorController,
  ],
})
export class FornecedorModule {}
