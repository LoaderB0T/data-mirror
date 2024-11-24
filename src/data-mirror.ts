import { getContext, runInContext } from './context.js';
import { Payload } from './payload.js';
import { DataMirrorStrategy } from './strategies/base.js';

type Callback<T> = (value: T) => void;

type CallbackEntry<T> = {
  callback: Callback<T>;
};

type DataMirrorRef = {
  unsubscribe: () => void;
};

export class DataMirror<T> {
  public readonly _hashFn: (value: T) => string;
  private readonly _callbacks: CallbackEntry<T>[] = [];
  private readonly _strategies: DataMirrorStrategy<T>[] = [];
  public readonly id: string;
  private _hash: string = '';

  constructor(id: string, hashFn: (value: T) => string) {
    console.log('DataMirror constructor');
    this.id = id;
    this._hashFn = hashFn;
  }

  public withStrategy(...strategies: DataMirrorStrategy<T>[]): DataMirror<T> {
    strategies.forEach(strategy => {
      strategy.setDataMirror(this);
      this._strategies.push(strategy);
      strategy.init();
    });
    return this;
  }

  public listenForChanges(callback: Callback<T>): DataMirrorRef {
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
