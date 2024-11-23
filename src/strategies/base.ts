import { getContext, runInContext } from '../context.js';
import { Payload } from '../payload.js';
import { Synchronizer } from '../synchronizer.js';

export abstract class SynchronizerStrategy<T> {
  private _synchronizer?: Synchronizer<T>;
  public readonly uniqueIdentifier = Symbol();
  private _hash?: string;

  protected get synchronizerId(): string {
    return this.synchronizer.id;
  }

  private get synchronizer(): Synchronizer<T> {
    if (!this._synchronizer) {
      throw new Error('Synchronizer not set');
    }
    return this._synchronizer;
  }

  // @internal
  public setSynchronizer(synchronizer: Synchronizer<T>) {
    this._synchronizer = synchronizer;
  }

  abstract init(): void;
  abstract onUpdate(value: Payload<T>): void;

  // @internal
  public update(payload: Payload<T>) {
    getContext().executedStrategies.push(this.uniqueIdentifier);

    if (this._hash === payload.hash) {
      return;
    }
    this._hash = payload.hash;
    this.onUpdate(payload);
  }

  protected updateSynchronizer(payload: Payload<T>) {
    runInContext(() => {
      this.synchronizer.updateFromStrategy(payload);
    });
  }
}
