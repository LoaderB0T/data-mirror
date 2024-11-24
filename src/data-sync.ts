import { getContext, runInContext } from './context.js';
import { Payload } from './payload.js';
import { DataSyncStrategy } from './strategies/base.js';

type Callback<T> = (value: T) => void;

type CallbackEntry<T> = {
  callback: Callback<T>;
};

type DataSyncRef = {
  unsubscribe: () => void;
};

export class DataSync<T> {
  public readonly _hashFn: (value: T) => string;
  private readonly _callbacks: CallbackEntry<T>[] = [];
  private readonly _strategies: DataSyncStrategy<T>[] = [];
  public readonly id: string;
  private _hash: string = '';

  constructor(id: string, hashFn: (value: T) => string) {
    console.log('DataSync constructor');
    this.id = id;
    this._hashFn = hashFn;
  }

  public withStrategy(...strategies: DataSyncStrategy<T>[]): DataSync<T> {
    strategies.forEach(strategy => {
      strategy.setDataSync(this);
      this._strategies.push(strategy);
      strategy.init();
    });
    return this;
  }

  public listenForChanges(callback: Callback<T>): DataSyncRef {
    this._callbacks.push({ callback });
    return {
      unsubscribe: () => {
        const index = this._callbacks.findIndex(entry => entry.callback === callback);
        if (index !== -1) {
          this._callbacks.splice(index, 1);
        }
      },
    };
  }

  public update(value: T) {
    runInContext(() => {
      const hash = this._hashFn(value);
      this.updateFromStrategy({
        value,
        hash,
      });
    });
  }

  public updateFromStrategy(payload: Payload<T>) {
    if (this._hash === payload.hash) {
      return;
    }
    this._hash = payload.hash;

    const { executedStrategies } = getContext();

    this._strategies
      .filter(s => !executedStrategies.includes(s.uniqueIdentifier))
      .forEach(strategy => {
        strategy.update(payload);
      });
    this._callbacks.forEach(entry => {
      entry.callback(payload.value);
    });
  }
}
