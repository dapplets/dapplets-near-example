import {} from '@dapplets/dapplet-extension';
import EXAMPLE_IMG from './icons/near_dapplet_icon.svg';
import DappletApi from './api';

@Injectable
export default class TwitterFeature {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/explicit-module-boundary-types
  @Inject('twitter-adapter.dapplet-base.eth') public adapter: any;
  private _overlay: any;

  async activate(): Promise<void> {

    if (!this._overlay) {
      const dappletApi = new DappletApi();
      this._overlay = (<any>Core).overlay(
        {
          name: 'overlay',
          title: 'Dapplets x NEAR example'
        }
      ).declare(dappletApi);
    }

    Core.onAction(() => this.openOverlay());

    const { button } = this.adapter.exports;
    this.adapter.attachConfig({
      POST: (ctx: any) =>
        button({
          DEFAULT: {
            img: EXAMPLE_IMG,
            tooltip: 'Parse Tweet',
            exec: () => {
              //console.log('parsedCtx:', ctx);
              this.openOverlay(ctx);
            },
          },
        }),
    });
  }

  async openOverlay(props?: any): Promise<void> {
    this._overlay.send('data', props);
  }
}
