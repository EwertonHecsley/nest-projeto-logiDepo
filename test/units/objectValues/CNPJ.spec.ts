import { BadRequestException } from '@nestjs/common';
import { CNPJ } from 'src/core/domain/objectValues/CNPJ';

describe('CNPJ Value Object', () => {
  it('deve criar um CNPJ válido sem máscara', () => {
    const cnpj = '12345678000195'; // 14 dígitos válidos
    const cnpjObj = CNPJ.create(cnpj);
    expect(cnpjObj.toString).toBe(cnpj);
  });

  it('deve criar um CNPJ válido com máscara', () => {
    const maskedCnpj = '12.345.678/0001-95';
    const expected = '12345678000195';
    const cnpjObj = CNPJ.create(maskedCnpj);
    expect(cnpjObj.toString).toBe(expected);
  });

  it('deve lançar BadRequestException para CNPJ inválido', () => {
    const invalidCnpj = '12345678'; // muito curto

    expect(() => CNPJ.create(invalidCnpj)).toThrow(BadRequestException);
    expect(() => CNPJ.create(invalidCnpj)).toThrow('CNPJ formato invalido.');
  });

  it('deve retornar o CNPJ formatado corretamente', () => {
    const cnpj = '12345678000195';
    const cnpjObj = CNPJ.create(cnpj);
    expect(cnpjObj.formatted).toBe('12.345.678/0001-95');
  });
});
