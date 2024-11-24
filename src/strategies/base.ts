import { getContext, runInContext } from '../context.js';
import { DataMirror } from '../data-mirror.js';
import { Payload } from '../payload.js';

export abstract class DataMirrorStrategy<T> {
  private _dataMirror?: DataMirror<T>;
  public readonly uniqueIdentifier = Symbol();
  private _hash?: string;

  protected get dataMirrorId(): string {
    return this.dataMirror.id;
  }

  private get dataMirror(): DataMirror<T> {
    if (!this._dataMirror) {
      throw new Error('DataMirror not set');
    }
    return this._dataMirror;
  }

  // @internal
  public setDataMirror(dataMirror: DataMirror<T>) {
    this._dataMirror = dataMirror;
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

  protected updateDataMirror(payload: Payload<T>) {
    runInContext(() => {
      this.dataMirror.updateFromStrategy(payload);
    });
  }
}