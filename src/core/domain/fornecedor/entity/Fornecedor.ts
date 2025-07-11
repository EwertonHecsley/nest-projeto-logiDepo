import { Entity } from 'src/core/generics/Entity';
import { Email } from '../../objectValues/Email';
import { CNPJ } from '../../objectValues/CNPJ';
import { Identity } from 'src/core/generics/Identity';
import { BadRequestException } from '@nestjs/common';

type FornecedorProps = {
  cnpj: CNPJ;
  razaoSocial: string;
  email: Email;
  createdAt?: Date;
};

export class Fornecedor extends Entity<FornecedorProps> {
  private constructor(attributes: FornecedorProps, id?: Identity) {
    super(attributes, id);
  }

  static create(attributes: FornecedorProps, id?: Identity): Fornecedor {
    if (!attributes.razaoSocial || attributes.razaoSocial.trim() === '') {
      throw new BadRequestException('Razao Social nao pode ser vazia.');
    }
    return new Fornecedor(
      {
        ...attributes,
        createdAt: attributes.createdAt ?? new Date(),
      },
      id,
    );
  }

  get cnpj(): CNPJ {
    return this.attributes.cnpj;
  }

  get razaoSocial(): string {
    return this.attributes.razaoSocial;
  }

  get email(): Email {
    return this.attributes.email;
  }

  get createdAt(): Date {
    return this.attributes.createdAt!;
  }

  get formattedCreatedAt(): string {
    return this.createdAt.toLocaleDateString('pt-br', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  updateRazaoSocial(value: string): void {
    if (!value || value.trim() == '') {
      throw new BadRequestException('Razao Social nao pode ser vazio.');
    }
    this.attributes.razaoSocial = value;
  }

  updateEmail(email: Email): void {
    if (!(email instanceof Email) || !email.toString) {
      throw new BadRequestException('Email invalido.');
    }
    this.attributes.email = email;
  }

  updateCnpj(cnpj: CNPJ): void {
    if (!(cnpj instanceof CNPJ) || !cnpj.toString) {
      throw new BadRequestException('CNPJ invalido.');
    }
    this.attributes.cnpj = cnpj;
  }
}
