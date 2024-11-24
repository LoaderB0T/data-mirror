import { Payload } from '../payload.js';
import { DataSyncStrategy } from './base.js';

type WindowRegistry<T> = Record<
  string,
  {
    update: (value: Payload<T>) => void;
    uniqueId: symbol;
  }[]
>;
type WindowRegistryT<T> = {
  __updateDataSyncWindowStrategy: WindowRegistry<T>;
};

export class DataSyncWindowStrategy<T> extends DataSyncStrategy<T> {
  private get getDataSync() {
    const win = window as typeof window & WindowRegistryT<T>;
    win.__updateDataSyncWindowStrategy ??= {};
    return win.__updateDataSyncWindowStrategy;
  }

  public init() {
    this.getDataSync[this.dataSyncId] ??= [];
    this.getDataSync[this.dataSyncId].push({
      update: (payload: Payload<T>) => {
        this.updateDataSync(payload);
      },
      uniqueId: this.uniqueIdentifier,
    });
  }

  public onUpdate(payload: Payload<T>) {
    this.getDataSync[this.dataSyncId]
      .filter(x => x.uniqueId !== this.uniqueIdentifier)
      .forEach(callback => {
        callback.update(payload);
      });
  }
}
