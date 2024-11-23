import { Payload } from '../payload.js';
import { SynchronizerStrategy } from './base.js';

type WindowRegistry<T> = Record<
  string,
  {
    update: (value: Payload<T>) => void;
    uniqueId: symbol;
  }[]
>;
type WindowRegistryT<T> = {
  __updateSynchronizerWindowStrategy: WindowRegistry<T>;
};

export class SynchronizerWindowStrategy<T> extends SynchronizerStrategy<T> {
  private get getSynchronizer() {
    const win = window as typeof window & WindowRegistryT<T>;
    win.__updateSynchronizerWindowStrategy ??= {};
    return win.__updateSynchronizerWindowStrategy;
  }

  public init() {
    this.getSynchronizer[this.synchronizerId] ??= [];
    this.getSynchronizer[this.synchronizerId].push({
      update: (payload: Payload<T>) => {
        this.updateSynchronizer(payload);
      },
      uniqueId: this.uniqueIdentifier,
    });
  }

  public onUpdate(payload: Payload<T>) {
    this.getSynchronizer[this.synchronizerId]
      .filter(x => x.uniqueId !== this.uniqueIdentifier)
      .forEach(callback => {
        callback.update(payload);
      });
  }
}
