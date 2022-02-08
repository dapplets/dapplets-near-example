interface IDappletApi {
  connectWallet: () => Promise<string>
  disconnectWallet: () => Promise<void>
  isWalletConnected: () => Promise<boolean>
  getCurrentNearAccount: () => Promise<string>
  getTweets: (nearId: string) => Promise<string[]>
  addTweet: (tweet: string) => Promise<void>
  removeTweet: (tweet: string) => Promise<void>
}

interface IContract {
  getTweets: ({ nearId }: { nearId: string }) => Promise<string[]>
  addTweet: ({ tweet }: { tweet: string }) => Promise<void>
  removeTweet: ({ tweet }: { tweet: string }) => Promise<void>
}

export default class implements IDappletApi {
  
  private _contract: IContract

  constructor() {
    Core.contract(
      'near',
      'dev-1634890606019-41631155713650',
      {
        viewMethods: ['getTweets'],
        changeMethods: ['addTweet', 'removeTweet'],
      }
    ).then((contract) => this._contract = contract);
  }

  async connectWallet() {
    const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
    await wallet.connect();
    return wallet.accountId;
  }

  async disconnectWallet() {
    const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
    wallet.disconnect();
  }

  async isWalletConnected() {
    const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
    return wallet.isConnected();
  }

  async getCurrentNearAccount() {
    const wallet = await Core.wallet({ type: 'near', network: 'testnet' });
    return wallet.accountId;
  }

  getTweets(nearId: string) { return this._contract.getTweets({ nearId }) }
  addTweet(tweet: string) { return this._contract.addTweet({ tweet }) }
  removeTweet(tweet: string) { return this._contract.removeTweet({ tweet }) }
}