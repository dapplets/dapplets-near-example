import {} from '@dapplets/dapplet-extension';
import EXAMPLE_IMG from './icons/near_dapplet_icon.svg';

@Injectable
export default class TwitterFeature {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/explicit-module-boundary-types
  @Inject('twitter-adapter.dapplet-base.eth') public adapter: any;
  private _overlay: any;

  async activate(): Promise<void> {

    const contract = Core.contract('near', 'dev-1634890606019-41631155713650', {
      viewMethods: ['getTweets'],
      changeMethods: ['addTweet', 'removeTweet'],
    });

    if (!this._overlay) {
      this._overlay = (<any>Core).overlay({ name: 'overlay', title: 'Dapplets x NEAR example' })
        .listen({
          connectWallet: async () => {
            try {
              const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
              await wallet.connect();
              this._overlay.send('connectWallet_done', wallet.accountId);
            } catch (err) {
              this._overlay.send('connectWallet_undone', err);
            }
          },
          disconnectWallet: async () => {
            try {
              const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
              await wallet.disconnect();
              this._overlay.send('disconnectWallet_done');
            } catch (err) {
              this._overlay.send('disconnectWallet_undone', err);
            }
          },
          isWalletConnected: async () => {
            try {
              const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
              const isWalletConnected = await wallet.isConnected();
              this._overlay.send('isWalletConnected_done', isWalletConnected);
            } catch (err) {
              this._overlay.send('isWalletConnected_undone', err);
            }
          },
          getCurrentNearAccount: async () => {
            try {
              const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
              this._overlay.send('getCurrentNearAccount_done', wallet.accountId);
            } catch (err) {
              this._overlay.send('getCurrentNearAccount_undone', err);
            }
          },
          getTweets: async (op: any, { type, message }: any) => {
            try {
              const tweets = await contract.getTweets({ nearId: message.accountId });
              this._overlay.send('getTweets_done', tweets);
            } catch (err) {
              this._overlay.send('getTweets_undone', err);
            }
          },
          addTweet: async (op: any, { type, message }: any) => {
            try {
              await contract.addTweet({ tweet: message.tweet });
              this._overlay.send('addTweet_done');
            } catch (err) {
              this._overlay.send('addTweet_undone', err);
            }
          },
          removeTweet: async (op: any, { type, message }: any) => {
            try {
              await contract.removeTweet({ tweet: message.tweet });
              this._overlay.send('removeTweet_done');
            } catch (err) {
              this._overlay.send('removeTweet_undone', err);
            }
          },
        });
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
              console.log('parsedCtx:', ctx);
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
