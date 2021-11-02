# Dapplets × NEAR example

**Dapplets × NEAR example** is a [Dapplet](https://dapplets.org) (an Augmentation App) that can parse Twitter posts and store them in the NEAR contract. It can also display your saved tweets on the overlay page.

## 1. Introduction

**Dapplets** - applications that interact with web-pages, augment them by inserting different widgets, parse the pages’ data and add some new functionalities. They can improve the user experience when using social media, video services and other sources.

Dapplets use the extension we are creating. This extension gives a simple API for dapplets developers and big abilities for the dapplets community. Our platform is decentralized. We use NEAR and Ethereum networks for our registries and contracts. We also use decentralized storages, like Swarm, IPFS and SIA for hosting dapplets code and multimedia.

To use our platform at first you need to install the **Dapplets Extension** . Currently it’s in the alpha-stage and is not published to Google Chrome or any other store. To install it follow this steps:

1. Open one of the following browsers: Google Chrome, Firefox, Brave, Tor.

> The following steps are described for Google Chrome. The steps may differ in other browsers.

2. Download the [**Dapplets Browser Extension**](https://github.com/dapplets/dapplet-extension/releases/latest).

3. Open **chrome://extensions** in a new tab.

4. Switch the **Developer mode** on and press **F5** to refresh the page.

   ![image](https://user-images.githubusercontent.com/43613968/117107075-ad076580-ad89-11eb-9046-58dd1ede2868.png)

5. **Drag and drop** the downloaded file into the extensions page. The extension will install automatically.

   ![image](https://user-images.githubusercontent.com/43613968/117132354-6cb8df00-adab-11eb-93bb-eb17b287e140.png)

   > If you are using Ubuntu or possibly another Linux OS the Dapplets extension can disappear from the Chrome Extensions after restarting the PC. To avoid this unzip the archive and use the `Load unpacked` button to add the extension.
   >
   > ![image](https://user-images.githubusercontent.com/43613968/118473499-b93cdc80-b712-11eb-8a1a-d3779e490e8c.png)
   >
   > ![image](https://user-images.githubusercontent.com/43613968/118473927-2ea8ad00-b713-11eb-9bbf-f2b7cb33a6bf.png)
  
6. Click to the **Dapplets** extension icon in extension bar. Try **Dapplets × NEAR example** dapplet.

## 2. Tutorial

Let's study how this dapplet works and why Dapplets is a NEAR frendly platform.

The goal of this example is to show the interaction between NEAR and Dapplets. If this is your first encounter with Dapplets we recommend trying our [documentation](https://docs.dapplets.org) first. It contains several exercises that explain how to create dapplets and adapters, from simple to complex ones. We highly recommend going through the [ex01](https://docs.dapplets.org/docs/extra-button) and [ex04](https://docs.dapplets.org/docs/overlays) examples that describe how to create the most basic dapplets and dapplets with an overlay. The knowledge you will get will make it easier to understand the current example.

The initial code for this example is in a separate branch: [exercise](https://github.com/dapplets/dapplets-near-example/tree/exercise)

You can clone this repo. It won't work directly. Try following steps to start it.

Let's look at the **structure**. There are three components: **dapplet**, **overlay** and **contract**. 

**Dapplet** is the entry point of the application. It uses adapters for interaction with web-pages, defining contexts to augment and widgets to insert. You can find the core functions of the extension inside a dapplet. We use **TypeScript** in our project.

We define **Overlay** as a place where a user can do something with parsed data, connect to core dapplet's functions through the **dapplet bridge** and manage augmentation parameters. It is an impotrant part of the application, but it runs in another environment and is published as a separate bundle. In most cases we use **React** as one of the most popular frameworks. But you can use a framework that you prefer or pure JavaScript or TypeScript.

**Contract** does not connect directly with other modules and may be located outside of the dapplet. However, this simple **NEAR** contract is created specifically for this dapplet. This is why it's convenient to place it in the application structure.

Let'a look at the each module.

### 2.1. Dapplet

Look at the `/dapplet/src/index.ts`.

At first we create injectable class with decorator `@Injectable` and use `@Inject` to add the **Twitter Adapter** as the `adapter` class variable. Also create `activate` method. It runs when the selected adapter finds specific context and is loading. It will contain all the main logic. 

```typescript
@Injectable
export default class TwitterFeature {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/explicit-module-boundary-types
  @Inject('twitter-adapter.dapplet-base.eth') public adapter: any;

  async activate(): Promise<void> {
    //
  }
}
```

Add the button to every tweet. Put this code to the `activate`:

```typescript
const { button } = this.adapter.exports;
this.adapter.attachConfig({
  POST: (ctx: any) =>
    button({
      DEFAULT: {
        img: EXAMPLE_IMG,
        tooltip: 'Parse Tweet',
        exec: () => {
          console.log('parsedCtx:', ctx);
        },
      },
    }),
});
```

Look at the code. We get widget `button` from the adapter. Then run adapter's method `attachConfig`. It receives an object with the names of contexts, that will be used, as keys. Values are functions that receive parsed context as the only argument and return a widget or an array of widgets. You may also return `null`, `false` or `undefined`.

**Widget** is a function that receives an object consisting of widget states. State parameters are described in the adapters documentation. You can find **Twitter Adapter** documentation [here](https://docs.dapplets.org/docs/adapters-docs-list#name=twitter-adapter.dapplet-base.eth&title=Twitter%20adapter&version=v0.9.0). In our case we add an image to the button and tooltip. `exec` is a function that runs when clicked. Now we just show the parsed context in the console.

Run the dapplet:

```bash
npm i
npm start
```

> :warning: Since the browser is blocking pages with problematic security certificates, go to https://localhost:3001/dapplet.json when the application is running and agree to run in **insecure mode**

Open the extension. Go to Developer tab and turn on the development server: `https://localhost:3001/dapplet.json`.

![image](https://user-images.githubusercontent.com/43613968/138610500-d40d1a49-040d-4524-afd4-18ff630f33ca.png)

Turn on the Dapplets tab. You will see the dev badge near our dapplet. Turn it on.

![image](https://user-images.githubusercontent.com/43613968/138610553-c4ce8cb9-bd19-46f4-8e60-a1fbd932f8a1.png)

Now you can see additional buttons on our tweets. Click on the button and open the console. You will see the parsed context of the tweet.

![image](https://user-images.githubusercontent.com/43613968/138664005-a8cf6930-b53b-4122-baa8-282d263c8cba.png)

You've done it! Congratulations!!! Go back to the code.

We want to show parsed data not in the console but to the users. We will use an overlay for this. But before implementing the overlay, add the interaction logic between the dapplet and the overlay to the dapplet.

Let's change our code. Add private class variable `_overlay` of type `any`. In the `activate` add the following code:

```typescript
if (!this._overlay) {
   this._overlay = (<any>Core).overlay({ name: 'overlay', title: 'Dapplets x NEAR example' });
}
```

Core function `Core.overlay` (typing problems will be fixed soon) receives an object with a **name** of the overlay and an overlay **title** and returns the `Overlay` object which we save in the `_overlay` variable.

Let's add **openOverlay** method to the class:

```typescript
async openOverlay(props?: any): Promise<void> {
 this._overlay.send('data', props);
}
```
In this example we call the method `send` the overlay. It takes two arguments: the name of this data and the data to send to the overlay.

Add `openOverlay` to `exec` function and pass the parsed context to the overlay. This is the current code of the dapplet:

```typescript
import {} from '@dapplets/dapplet-extension';
import EXAMPLE_IMG from './icons/near_dapplet_icon.svg';

@Injectable
export default class TwitterFeature {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/explicit-module-boundary-types
  @Inject('twitter-adapter.dapplet-base.eth') public adapter: any;

  private _overlay: any;

  async activate(): Promise<void> {

    if (!this._overlay) {
      this._overlay = (<any>Core).overlay({ name: 'overlay', title: 'Dapplets x NEAR example' });
    }

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
```

Open the manifest `./dapplet/dapplet.json`.

```json
{
  "name": { "$ref": "package.json#/name" },
  "branch": "default",
  "version": { "$ref": "package.json#/version" },
  "type": "FEATURE",
  "title": "Dapplets x NEAR example",
  "description": { "$ref": "package.json#/description" },
  "main": { "$ref": "package.json#/main" },
  "icon": "src/icons/near_dapplet_icon_70.png",
  "contextIds": ["twitter-adapter.dapplet-base.eth"],
  "config": {
    "schema": "config/schema.json",
    "default": "config/default.json"
  },
  "overlays": {
    "overlay": "https://localhost:3000"
  },
  "dependencies": {
    "twitter-adapter.dapplet-base.eth": "0.9.0"
  }
}
```

> :warning: Since the browser is blocking pages with problematic security certificates, go to https://localhost:3000 when the application is running and agree to run in **insecure mode**.

Here we see the URL of the overlay named `'overlay'` that will be used in developers mode. During the publication of the dapplet to the registry the overlay will be published to the decentralized storage.

We also see the Twitter Adapter in the dependencies. We are using the 0.9.0 version in the example.

Let's go to the overlay.

### 2.2. Overlay

As we previously mentioned, the overlay can be created in any way you want. We use **React** in most of our projects.
We will not be analyzing the entire overlay code, but only the important points for our architectural aspects.

For interaction with the dapplet install the npm package `@dapplets/dapplet-overlay-bridge`:

```bash
npm i @dapplets/dapplet-overlay-bridge
```

To get the data from the dapplet we need the class **Bridge** in the overlay part. Look at the module `./overlay/src/dappletBridge.ts`. Here is the `onData` method where we subscribe on the `'data'` event, which we've described in the dapplet.

```typescript
_subId: number = 0;

onData(callback: (data?: any) => void) {
 this.subscribe('data', (data: any) => {
   this._subId = Math.trunc(Math.random() * 1_000_000_000);
   callback(data);
   return this._subId.toString();
 });
}
```

Then we use it in the `App.tsx` module.

```typescript
/* */
import { bridge } from './dappletBridge';
/* */
export default () => {
  const [parsedCtx, setParsedCtx] = useState<ICtx>();
  /* */
  useEffect(() => {
    bridge.onData((data?: ICtx) => {
      setParsedCtx(data);
    });
    /* */
  }, []);
  /* */
}
```

Now save the changes and reload the Twitter page. When you click on the button you will see the overlay with the selected tweet data.

![image](https://user-images.githubusercontent.com/43613968/138663433-e93af4ab-d96d-4e72-bb56-952737281dbe.png)

Thats cool! But our goal is to save this data to NEAR chain and get it back. So let's see the contract.

### 2.3. NEAR smart contract


Look at the th module `./contract`. There is a simple NEAR smart contract written in AssemblyScript with `create-near-app`.

In `./contract/assembly/index.ts` we see one `PersistentUnorderedMap` named `tweetsByNearId`. It stores an array of serialized tweets data with the current user ID. It has methods for saving, removing and retrieving saved tweets.

You can find all the nessesary data about how to write, test and deploy NEAR smart contracts in the official [documentation](https://docs.near.org/) and [Learn NEAR](https://learnnear.club/) courses and guides.

Let's see how to connect to the smart contract and use its methods in the dapplet.

Add the following code to the `activate` method of the `./dapplet/src/index.ts` module:

```typescript
 const contract = Core.contract('near', 'dev-1634890606019-41631155713650', {
   viewMethods: ['getTweets'],
   changeMethods: ['addTweet', 'removeTweet'],
 });
```

There is a `Core.contract` method that receives 3 parameters: name of the network ('near' or 'etherium'), contract name and object with view and change methods.

Now we will make the contract methods available in the overlay. In order to pass the methods through the dapplets bridge, add a `listen` function to the overlay call. Don't be afraid, just copy and paste this code :)

```typescript
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
```

The last three asynchronius functions pass our contract methods to the overlay. The first four functions need to pair the wallet to the dapplet. To get the `Wallet` object we use the **`Core.wallet`** method, with named parameters `name` (`near` or `ethereum`) and `network`. The wallet has methods **`isConnected`**, **`connect`**, **`disconnect`** and parameter **`accountId`**.

The next step is to change `./overlay/src/dappletBridge.ts`. We have to make functions that were described in the dapplet, available in the overlay. Copy the following code to the **`Bridge`** class:

```typescript
async connectWallet(): Promise<string> {
 return this.call(
   'connectWallet',
   null,
   'connectWallet_done',
   'connectWallet_undone'
 );
}

async disconnectWallet(): Promise<string> {
  return this.call(
    'disconnectWallet',
    null,
    'disconnectWallet_done',
    'disconnectWallet_undone'
  );
}

async isWalletConnected(): Promise<boolean> {
  return this.call(
    'isWalletConnected',
    null,
    'isWalletConnected_done',
    'isWalletConnected_undone'
  );
}

async getCurrentNearAccount(): Promise<string> {
  return this.call(
    'getCurrentNearAccount',
    null,
    'getCurrentNearAccount_done',
    'getCurrentNearAccount_undone'
  );
}

async getTweets(accountId: string): Promise<string[]> {
  return this.call(
    'getTweets',
    { accountId },
    'getTweets_done',
    'getTweets_undone'
  );
}

async addTweet(tweet: string): Promise<string> {
  return this.call(
    'addTweet',
    { tweet },
    'addTweet_done',
    'addTweet_undone'
  );
}

async removeTweet(tweet: string): Promise<string> {
  return this.call(
    'removeTweet',
    { tweet },
    'removeTweet_done',
    'removeTweet_undone'
  );
}

public async call(
  method: string,
  args: any,
  callbackEventDone: string,
  callbackEventUndone: string
): Promise<any> {
  return new Promise((res, rej) => {
    this.publish(this._subId.toString(), {
      type: method,
      message: args,
    });
    this.subscribe(callbackEventDone, (result: any) => {
      this.unsubscribe(callbackEventDone);
      this.unsubscribe(callbackEventUndone);
      res(result);
    });
    this.subscribe(callbackEventUndone, () => {
      this.unsubscribe(callbackEventUndone);
      this.unsubscribe(callbackEventDone);
      rej('The transaction was rejected.');
    });
  });
}
```

Now we can use contract methods in the overlay modules. We can authorize the dapplet with the NEAR testnet wallet and save the data of the selected tweets to the smart contract. We can also see our saved data in the overlay.

Uncommit all the commited code in the `./overlay/src/App.tsx`. Save changes and reload the Twitter page.

![image](https://user-images.githubusercontent.com/43613968/138758615-c3f396d9-a15f-4964-967a-d771d25b833a.png)

A cherry on top will be the addition of the ability to view saved tweets without parsing new ones. To do this, it is enough to add the `Core.onAction` method to the `activate` in `./dapplet/src/index.ts` and pass the function of opening the overlay to it.

```typescript
Core.onAction(() => this.openOverlay());
```

Now you will see the home icon near the dapplets name.

![image](https://user-images.githubusercontent.com/43613968/138760150-ad966eb5-46e3-423e-9097-094b7297f169.png)

A click on the button opens an overlay with saved tweets.

![image](https://user-images.githubusercontent.com/43613968/138760448-185d6165-68e5-4e5f-bed8-6b90735476cb.png)

Congratulations to everyone who made it to the end of the tutorial! We hope it was successful.

Here is the result: [dapplets-near-example](https://github.com/dapplets/dapplets-near-example)

If something didn't work out for you, or you still have some questions, you are welcome to our chats in [Discord](https://discord.gg/YcxbkcyjMV) and [Telegram](https://t.me/dapplets).

Thank you for your time. We hope this new knowledge will be useful, and you will go on to develop impressive and successful applications on the Dapplets platform using the capabilities of NEAR protocol 🚀✨

## Contacts

Web: [dapplets.org](https://dapplets.org)
Docs: [docs.dapplets.org](https://docs.dapplets.org)
GitHub: [github.com/dapplets](https://github.com/dapplets)
Discord: [discord.gg/YcxbkcyjMV](https://discord.gg/YcxbkcyjMV)
Telegram: [t.me/dapplets](https://t.co/4HBqF5JEbh?amp=1)
Twitter: [@dappletsproject](https://twitter.com/dappletsproject)
