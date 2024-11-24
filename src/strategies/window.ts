import { Payload } from '../payload.js';
import { DataMirrorStrategy } from './base.js';

type WindowRegistry<T> = Record<
  string,
  {
    update: (value: Payload<T>) => void;
    uniqueId: symbol;
  }[]
>;
type WindowRegistryT<T> = {
  __updateDataMirrorWindowStrategy: WindowRegistry<T>;
};

export class DataMirrorWindowStrategy<T> extends DataMirrorStrategy<T> {
  private get getDataMirror() {
    const win = window as typeof window & WindowRegistryT<T>;
    win.__updateDataMirrorWindowStrategy ??= {};
    return win.__updateDataMirrorWindowStrategy;
  }

  public init() {
    this.getDataMirror[this.dataMirrorId] ??= [];
    this.getDataMirror[this.dataMirrorId].push({
      update: (payload: Payload<T>) => {
        this.updateDataMirror(payload);
      },
      uniqueId: this.uniqueIdentifier,
    });
  }

  public onUpdate(payload: Payload<T>) {
    this.getDataMirror[this.dataMirrorId]
      .filter(x => x.uniqueId !== this.uniqueIdentifier)
      .forEach(callback => {
        callback.update(payload);
      });
  }
}
