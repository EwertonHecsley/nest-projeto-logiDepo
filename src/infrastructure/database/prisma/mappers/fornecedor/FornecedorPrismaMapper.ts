import { Fornecedor as FornecedorDatabase } from '@prisma/client';
import { Fornecedor } from 'src/core/domain/fornecedor/entity/Fornecedor';
import { CNPJ } from 'src/core/domain/objectValues/CNPJ';
import { Email } from 'src/core/domain/objectValues/Email';
import { Identity } from 'src/core/generics/Identity';

export class FornecedorPrismaMapper {
  static toDatabase(entity: Fornecedor): FornecedorDatabase {
    return {
      id: entity.id.toString,
      razaoSocial: entity.razaoSocial,
      cnpj: entity.cnpj.formatted,
      email: entity.email.toString,
      createdAt: entity.createdAt,
    };
  }

  static toDomain(entityDatabase: FornecedorDatabase): Fornecedor {
    return Fornecedor.create(
      {
        razaoSocial: entityDatabase.razaoSocial,
        cnpj: CNPJ.create(entityDatabase.cnpj),
        email: Email.create(entityDatabase.email),
        createdAt: entityDatabase.createdAt,
      },
      new Identity(entityDatabase.id),
    );
  }
}
