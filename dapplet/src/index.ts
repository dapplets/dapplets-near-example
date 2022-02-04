import {} from '@dapplets/dapplet-extension';
import EXAMPLE_IMG from './icons/near_dapplet_icon.svg';

interface IDappletApi {
  connectWallet: () => Promise<string>
  disconnectWallet: () => Promise<void>
  isWalletConnected: () => Promise<boolean>
  getCurrentNearAccount: () => Promise<string>
  getTweets: (nearId: string) => Promise<string[]>
  addTweet: (tweet: string) => Promise<void>
  removeTweet: (tweet: string) => Promise<void>
}

@Injectable
export default class TwitterFeature {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/explicit-module-boundary-types
  @Inject('twitter-adapter.dapplet-base.eth') public adapter: any;
  private _overlay: any;

  async activate(): Promise<void> {

    const contract = await Core.contract(
      'near',
      'dev-1634890606019-41631155713650',
      {
        viewMethods: ['getTweets'],
        changeMethods: ['addTweet', 'removeTweet'],
      }
    );

    if (!this._overlay) {
      const dappletApi: IDappletApi = {
        connectWallet: async () => {
          const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
          await wallet.connect();
          return wallet.accountId;
        },
        disconnectWallet: async () => {
          const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
          wallet.disconnect();
        },
        isWalletConnected: async () => {
          const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
          return wallet.isConnected();
        },
        getCurrentNearAccount: async () => {
          const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
          return wallet.accountId;
        },
        getTweets: (nearId: string) => contract.getTweets({ nearId }),
        addTweet: (tweet: string) => contract.addTweet({ tweet }),
        removeTweet: (tweet: string) => contract.removeTweet({ tweet }),
      }
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
