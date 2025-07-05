import { BadRequestException } from '@nestjs/common';

export class CNPJ {
  private constructor(private readonly _value: string) {}

  static create(cnpj: string): CNPJ {
    const numericCnpj = CNPJ.sanitize(cnpj);

    if (!CNPJ.isValidFormat(numericCnpj)) {
      throw new BadRequestException('CNPJ formato invalido.');
    }

    return new CNPJ(numericCnpj);
  }

  private static sanitize(cnpj: string): string {
    return cnpj.replace(/[^\d]/g, '');
  }

  private static isValidFormat(cnpj: string): boolean {
    return /^\d{14}$/.test(cnpj);
  }

  public get toString(): string {
    return this._value;
  }

  public get formatted(): string {
    return this._value.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5',
    );
  }
}
