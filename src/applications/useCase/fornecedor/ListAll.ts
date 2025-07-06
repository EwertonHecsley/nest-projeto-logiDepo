import { Fornecedor } from 'src/core/domain/fornecedor/entity/Fornecedor';
import { FornecedorRepository } from 'src/core/domain/fornecedor/repository/Fornecedor.repository';

export class ListAllFornecedorUseCase {
  constructor(private readonly fornecedorRepository: FornecedorRepository) {}

  async execute(): Promise<Fornecedor[]> {
    return await this.fornecedorRepository.findAll();
  }
}
