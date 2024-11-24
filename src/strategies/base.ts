import { getContext, runInContext } from '../context.js';
import { DataSync } from '../data-sync.js';
import { Payload } from '../payload.js';

export abstract class DataSyncStrategy<T> {
  private _dataSync?: DataSync<T>;
  public readonly uniqueIdentifier = Symbol();
  private _hash?: string;

  protected get dataSyncId(): string {
    return this.dataSync.id;
  }

  private get dataSync(): DataSync<T> {
    if (!this._dataSync) {
      throw new Error('DataSync not set');
    }
    return this._dataSync;
  }

  // @internal
  public setDataSync(dataSync: DataSync<T>) {
    this._dataSync = dataSync;
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

  protected updateDataSync(payload: Payload<T>) {
    runInContext(() => {
      this.dataSync.updateFromStrategy(payload);
    });
  }
}
