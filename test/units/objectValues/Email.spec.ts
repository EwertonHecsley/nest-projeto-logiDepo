import { BadRequestException } from '@nestjs/common';
import { Email } from 'src/core/domain/objectValues/Email';

describe('Email Value Object', () => {
  it('deve criar um Email válido', () => {
    const validEmail = 'teste@exemplo.com';
    const email = Email.create(validEmail);
    expect(email.toString).toBe(validEmail);
  });

  it('deve lançar BadRequestException para email inválido', () => {
    const invalidEmail = 'email-invalido';

    expect(() => Email.create(invalidEmail)).toThrow(BadRequestException);
    expect(() => Email.create(invalidEmail)).toThrow(
      'Formato de Email invalido.',
    );
  });

  it('toString deve retornar o valor correto', () => {
    const validEmail = 'usuario@dominio.com';
    const email = Email.create(validEmail);
    expect(email.toString).toBe(validEmail);
  });
});
