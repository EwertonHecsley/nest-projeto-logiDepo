import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Fornecedor } from 'src/core/domain/fornecedor/entity/Fornecedor';
import { CNPJ } from 'src/core/domain/objectValues/CNPJ';
import { Email } from 'src/core/domain/objectValues/Email';
import { Either, left, right } from 'src/shared/either';

type FornecedorProps = {
  cnpj: string;
  razaoSocial: string;
  email: string;
};

type Response = Either<BadRequestException, Fornecedor>;

export class FornecedorCreateFactory {
  static create(props: FornecedorProps): Response {
    const { cnpj, email, razaoSocial } = props;

    try {
      const _cnpj = CNPJ.create(cnpj);
      const _email = Email.create(email);

      const fornecedor = Fornecedor.create({
        cnpj: _cnpj,
        email: _email,
        razaoSocial,
      });
      return right(fornecedor);
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        return left(new BadRequestException(error.message));
      }
      return left(
        new InternalServerErrorException('Erro interno no servidor.'),
      );
    }
  }
}
