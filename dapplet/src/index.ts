import { } from '@dapplets/dapplet-extension';
import EXAMPLE_IMG from './icons/near_dapplet_icon.svg';
import DappletApi from './api';

interface ITweet {
  authorFullname: string
  authorUsername?: string
  authorImg: string
  id: string
  text: string
}

interface IState {
  nearAccount: string
  parsedCtx?: ITweet
}

@Injectable
export default class TwitterFeature {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/explicit-module-boundary-types
  @Inject('twitter-adapter.dapplet-base.eth') public adapter: any;

  async activate(): Promise<void> {
    const dappletApi = new DappletApi();
    if (Core.state === undefined) {
      alert(`
DAPPLETS X NEAR EXAMPLE DAPPLET

Download the latest version of Dapplets Extension here:

https://github.com/dapplets/dapplet-extension/releases/latest
      `);
      return;
    }
    const state = Core.state<IState>({ nearAccount: '' });
    const overlay = Core.overlay({ name: 'overlay', title: 'Dapplets x NEAR example' })
      .useState(state)
      .declare(dappletApi);

    const isWalletConnected = await dappletApi.isWalletConnected();
    const nearAccount = isWalletConnected ? await dappletApi.getCurrentNearAccount() : '';
    state.global.nearAccount.next(nearAccount);

    Core.onAction(() => {
      state.global.parsedCtx.next(undefined);
      overlay.open();
    });

    const { button } = this.adapter.exports;
    this.adapter.attachConfig({
      POST: (ctx: ITweet) =>
        button({
          DEFAULT: {
            img: EXAMPLE_IMG,
            tooltip: 'Parse Tweet',
            exec: () => {
              state.global.parsedCtx.next(ctx);
              if (!overlay.isOpen()) overlay.open();
            },
          },
        }),
    });
  }
}
