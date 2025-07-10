import { Entity } from 'src/core/generics/Entity';
import { Identity } from 'src/core/generics/Identity';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'mocked-uuid'),
}));

interface FakeAttributes {
  name: string;
  value: number;
}

class FakeEntity extends Entity<FakeAttributes> {
  constructor(attrs: FakeAttributes, id?: Identity) {
    super(attrs, id);
  }

  // só para acessar os atributos no teste
  get props(): FakeAttributes {
    return this.attributes;
  }
}

describe('Entity<T>', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar a entidade com um ID automático se não for fornecido', () => {
    const entity = new FakeEntity({ name: 'teste', value: 42 });

    expect(entity.id.toString).toBe('mocked-uuid');
  });

  it('deve manter o ID fornecido', () => {
    const customId = new Identity('custom-id');
    const entity = new FakeEntity({ name: 'teste', value: 42 }, customId);

    expect(entity.id.toString).toBe('custom-id');
  });

  it('deve armazenar os atributos corretamente', () => {
    const attrs = { name: 'banana', value: 99 };
    const entity = new FakeEntity(attrs);

    expect(entity.props).toEqual(attrs);
  });
});
