import { Identity } from './Identity';

export class Entity<T> {
  private _entityId: Identity;
  protected attributes: T;

  protected constructor(attributes: T, id?: Identity) {
    this.attributes = attributes;
    this._entityId = id ?? new Identity();
  }

  get id(): Identity {
    return this._entityId;
  }
}
