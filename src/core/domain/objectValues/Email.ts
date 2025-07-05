import { BadRequestException } from '@nestjs/common';

export class Email {
  private constructor(private readonly _value: string) {}

  static create(email: string): Email {
    if (!Email.isValidEmail(email)) {
      throw new BadRequestException('Formato de Email invalido.');
    }
    return new Email(email);
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public get toString(): string {
    return this._value;
  }
}
