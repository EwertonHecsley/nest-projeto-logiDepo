import { BadRequestException } from '@nestjs/common';
import { FornecedorRepository } from 'src/core/domain/fornecedor/repository/Fornecedor.repository';
import { CNPJ } from 'src/core/domain/objectValues/CNPJ';
import { Email } from 'src/core/domain/objectValues/Email';
import { Either, left, right } from 'src/shared/either';

type UpdateProps = {
  id: string;
  cnpj?: string;
  email?: string;
  razaoSocial?: string;
};

type UpdateResult = {
  newCnpj?: CNPJ;
  newEmail?: Email;
  newRazaoSocial?: string;
};

type Response = Either<BadRequestException, UpdateResult>;

export class FornecedorUpdateFactory {
  static async validateAndCreate(
    props: UpdateProps,
    repository: FornecedorRepository,
  ): Promise<Response> {
    try {
      const { cnpj, email, razaoSocial, id } = props;
      const result: UpdateResult = {};

      if (cnpj) {
        const existing = await repository.findByCnpj(cnpj);
        if (existing && existing.id.toString !== id) {
          return left(new BadRequestException('CNPJ já cadastrado.'));
        }
        result.newCnpj = CNPJ.create(cnpj);
      }

      if (email) {
        const existing = await repository.findByEmail(email);
        if (existing && existing.id.toString !== id) {
          return left(new BadRequestException('Email já cadastrado.'));
        }
        result.newEmail = Email.create(email);
      }

      if (razaoSocial) {
        result.newRazaoSocial = razaoSocial;
      }

      return right(result);
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        return left(error);
      }

      return left(
        new BadRequestException(
          'Erro inesperado ao validar dados do fornecedor.',
        ),
      );
    }
  }
}
