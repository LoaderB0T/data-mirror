import { Payload } from '../payload.js';
import { DataMirrorStrategy } from './base.js';

export class DataMirrorBroadcastStrategy<T> extends DataMirrorStrategy<T> {
  private _broadcast?: BroadcastChannel;

  private get broadcast(): BroadcastChannel {
    if (!this._broadcast) {
      throw new Error('Broadcast not initialized');
    }
    return this._broadcast;
  }

  public init() {
    this._broadcast = new BroadcastChannel(`__dataMirrorBroadcastStrategy_${this.dataMirrorId}`);
    this._broadcast.onmessage = event => {
      this.updateDataMirror(event.data);
    };
  }

  public onUpdate(payload: Payload<T>) {
    this.broadcast.postMessage(payload);
  }
}
