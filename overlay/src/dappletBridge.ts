import GeneralBridge from '@dapplets/dapplet-overlay-bridge';

class Bridge extends GeneralBridge {
  _subId: number = 0;

  onData(callback: (data?: any) => void) {
    this.subscribe('data', (data: any) => {
      this._subId = Math.trunc(Math.random() * 1_000_000_000);
      callback(data);
      return this._subId.toString();
    });
  }

}

const bridge = new Bridge();

export { bridge, Bridge };
