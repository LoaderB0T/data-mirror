import { Payload } from '../payload.js';
import { SynchronizerStrategy } from './base.js';

export class SynchronizerBroadcastStrategy<T> extends SynchronizerStrategy<T> {
  private _broadcast?: BroadcastChannel;

  private get broadcast(): BroadcastChannel {
    if (!this._broadcast) {
      throw new Error('Broadcast not initialized');
    }
    return this._broadcast;
  }

  public init() {
    this._broadcast = new BroadcastChannel(
      `__synchronizerBroadcastStrategy_${this.synchronizerId}`
    );
    this._broadcast.onmessage = event => {
      this.updateSynchronizer(event.data);
    };
  }

  public onUpdate(payload: Payload<T>) {
    this.broadcast.postMessage(payload);
  }
}
