import { Payload } from '../payload.js';
import { DataSyncStrategy } from './base.js';

export class DataSyncBroadcastStrategy<T> extends DataSyncStrategy<T> {
  private _broadcast?: BroadcastChannel;

  private get broadcast(): BroadcastChannel {
    if (!this._broadcast) {
      throw new Error('Broadcast not initialized');
    }
    return this._broadcast;
  }

  public init() {
    this._broadcast = new BroadcastChannel(`__dataSyncBroadcastStrategy_${this.dataSyncId}`);
    this._broadcast.onmessage = event => {
      this.updateDataSync(event.data);
    };
  }

  public onUpdate(payload: Payload<T>) {
    this.broadcast.postMessage(payload);
  }
}
