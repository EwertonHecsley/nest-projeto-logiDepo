import { BadRequestException } from '@nestjs/common';
import { Fornecedor } from 'src/core/domain/fornecedor/entity/Fornecedor';
import { CNPJ } from 'src/core/domain/objectValues/CNPJ';
import { Email } from 'src/core/domain/objectValues/Email';
import { Identity } from 'src/core/generics/Identity';

describe('Fornecedor Entity', () => {
  const validCnpj = CNPJ.create('12.345.678/0001-95');
  const validEmail = Email.create('teste@exemplo.com');
  const validRazaoSocial = 'Empresa LTDA';

  it('deve criar um Fornecedor válido', () => {
    const fornecedor = Fornecedor.create({
      cnpj: validCnpj,
      email: validEmail,
      razaoSocial: validRazaoSocial,
    });

    expect(fornecedor.cnpj.toString).toBe('12345678000195');
    expect(fornecedor.email.toString).toBe('teste@exemplo.com');
    expect(fornecedor.razaoSocial).toBe(validRazaoSocial);
    expect(fornecedor.createdAt).toBeInstanceOf(Date);
  });

  it('deve lançar erro se razão social for vazia', () => {
    expect(() =>
      Fornecedor.create({
        cnpj: validCnpj,
        email: validEmail,
        razaoSocial: '   ',
      }),
    ).toThrow(BadRequestException);
  });

  it('deve aceitar id customizado na criação', () => {
    const customId = new Identity('custom-id-123');
    const fornecedor = Fornecedor.create(
      {
        cnpj: validCnpj,
        email: validEmail,
        razaoSocial: validRazaoSocial,
      },
      customId,
    );

    expect(fornecedor.id.toString).toBe('custom-id-123');
  });

  it('deve atualizar razão social com valor válido', () => {
    const fornecedor = Fornecedor.create({
      cnpj: validCnpj,
      email: validEmail,
      razaoSocial: validRazaoSocial,
    });

    fornecedor.updateRazaoSocial('Nova Razao Social');
    expect(fornecedor.razaoSocial).toBe('Nova Razao Social');
  });

  it('deve lançar erro ao atualizar razão social com valor vazio', () => {
    const fornecedor = Fornecedor.create({
      cnpj: validCnpj,
      email: validEmail,
      razaoSocial: validRazaoSocial,
    });

    expect(() => fornecedor.updateRazaoSocial('')).toThrow(BadRequestException);
    expect(() => fornecedor.updateRazaoSocial('   ')).toThrow(
      BadRequestException,
    );
  });

  it('deve atualizar email com valor válido', () => {
    const fornecedor = Fornecedor.create({
      cnpj: validCnpj,
      email: validEmail,
      razaoSocial: validRazaoSocial,
    });

    const novoEmail = Email.create('novo@email.com');
    fornecedor.updateEmail(novoEmail);

    expect(fornecedor.email.toString).toBe('novo@email.com');
  });

  it('deve lançar erro ao atualizar email inválido', () => {
    const fornecedor = Fornecedor.create({
      cnpj: validCnpj,
      email: validEmail,
      razaoSocial: validRazaoSocial,
    });

    expect(() => fornecedor.updateEmail(null as any)).toThrow(
      BadRequestException,
    );
    expect(() => fornecedor.updateEmail({} as any)).toThrow(
      BadRequestException,
    );
  });

  it('deve atualizar cnpj com valor válido', () => {
    const fornecedor = Fornecedor.create({
      cnpj: validCnpj,
      email: validEmail,
      razaoSocial: validRazaoSocial,
    });

    const novoCnpj = CNPJ.create('12.345.678/0001-99');
    fornecedor.updateCnpj(novoCnpj);

    expect(fornecedor.cnpj.toString).toBe('12345678000199');
  });

  it('deve lançar erro ao atualizar cnpj inválido', () => {
    const fornecedor = Fornecedor.create({
      cnpj: validCnpj,
      email: validEmail,
      razaoSocial: validRazaoSocial,
    });

    expect(() => fornecedor.updateCnpj(null as any)).toThrow(
      BadRequestException,
    );
    expect(() => fornecedor.updateCnpj({} as any)).toThrow(BadRequestException);
  });

  it('deve retornar createdAt formatado corretamente', () => {
    const date = new Date('2023-07-10T14:30:00');
    const fornecedor = Fornecedor.create({
      cnpj: validCnpj,
      email: validEmail,
      razaoSocial: validRazaoSocial,
      createdAt: date,
    });

    const formatted = fornecedor.formattedCreatedAt;

    expect(formatted).toMatch(/10\/07\/2023/);
  });
});
