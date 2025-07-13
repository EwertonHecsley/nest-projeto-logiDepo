import { Fornecedor } from 'src/core/domain/fornecedor/entity/Fornecedor';

export class FornecedorPrismaPresenter {
  static toHTTP(entity: Fornecedor) {
    return {
      id: entity.id.toString,
      razao_social: entity.razaoSocial,
      cnpj: entity.cnpj.formatted,
      email: entity.email.toString,
      created: entity.formattedCreatedAt,
    };
  }
}
