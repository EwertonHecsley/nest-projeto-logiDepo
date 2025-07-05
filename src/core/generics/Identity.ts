import { randomUUID } from 'crypto';

export class Identity {
  private value: string;

  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }

  get toString(): string {
    return this.value;
  }
}
