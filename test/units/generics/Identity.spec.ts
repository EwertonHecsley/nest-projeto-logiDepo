import { randomUUID } from 'crypto';
import { Identity } from 'src/core/generics/Identity';


jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'mocked-uuid'),
}));

describe('Identity', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Deve criar um Identity com o valor passado.', () => {
    const id = new Identity('exemplo-uuid');
    expect(id.toString).toBe('exemplo-uuid');
  });

  it('deve gerar um uuid se nenhum valor for passado', () => {
    const id = new Identity();
    expect(randomUUID).toHaveBeenCalled();
    expect(id.toString).toBe('mocked-uuid');
  });

  it('toString deve retornar o valor corretamente', () => {
    const id = new Identity('123abc');
    expect(id.toString).toBe('123abc');
  });
});
