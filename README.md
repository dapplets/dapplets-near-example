# Dapplets × NEAR example

**Dapplets × NEAR example** is a [Dapplet](https://dapplets.org) (an Augmentation App) that can parse Twitter tweets and store them in the NEAR contract. It can also display your saved tweets in the overlay page.

## Introduction

Dapplets - applications that interact with web-pages, augment them by inserting different widgets, parsing pages data and adding some new functionality. It may improove user experience of using social media, video services and other sourses.

Dapplets use the extension we are creating. It gives a simple api for dapplets developers and big abilities for our community.

To use our platform at first you need to install the Dapplets extension. Currently it's on the alfa-stage and not published to Google Chrome or some other store. To install it follow this steps:

1. Open one of the following browsers: Google Chrome, Firefox, Brave, Tor.

> The following steps are described for Google Chrome. The steps may differ in other browsers.

2. Download the [**Dapplet Browser Extension**](https://github.com/dapplets/dapplet-extension/releases/latest).

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

## Tutorial

Let's study how this dapplet works and why Dapplets is a NEAR frendly platform.

The goal of the example is to show interaction of NEAR and Dapplets. If it is your very first meeting with Dapplets we recommend you to try our [documentation.](https://docs.dapplets.org) It contains several exercises that explane how to create dapplets and adapters from simple to complex ones. We are highly recommend to go through the [ex01](https://docs.dapplets.org/extra-button) and [ex04](https://docs.dapplets.org/overlays) examples that describe how to create the simpliest dapplet and the dapplet with the overlay. The knowledges you'll get make easy to understand the current example.

The initial code for this example is here: [dapplets-near-example.](https://github.com/dapplets/dapplets-near-example)

You can clone this repo. It won't work directly. Try following steps to start it.

Let's look at the **structure**. There are three components: **dapplet**, **overlay** and **contract**. 

**Dapplet** is the entry point of the application. It use adapters to interact with web-pages, define conext to augment and widgets to insert. Also the core functions of the extension are  available there. We use **Typescript** in our progect.

We define **Overlay** as a place where a user can do something with parsed data, connect to core dapplet's functions through the **dapplet bridge** and manage augmentation parameters. It is an impotrant part of the application but it runs in another environment and published as a separate module. In the most cases we use **React** as a one of the most popular framework. But you can use a framework that you prefer or the pure javascript or typescript.

**Contract** does not connect directly with other modules and may located outside the dapplet. But this simple **NEAR** contract created only for this dapplet. So it's comfortable to place it here.

Let'a look at the each module.

### Dapplet

Look at the `/dapplet/src/index.ts`.

At first we create injectable class with decorator `@Injectable` and use `@Ingect` to add **Twitter Adapter** as the `adapter` class variable. Also create `activate` method. It runs when selected adapter finds specific context and is loading. It will contain all the main logic. 

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

Look at the code. We get widget `button` from the adapter. Then run adapter's method `attachConfig`. It reseives an object with names of contexts, that will be used, as keys. Values are functions, that reseives parsed context as the only argument and returns widget or the array of widgets. You may also return `null`, `false` or `undefined`.

**Widget** is a function that reseives an object consisting of widget states. State parameters are described in the adapters documentation. **Twitter Adapter** documentation you can find [here](https://docs.dapplets.org/docs/adapters-docs-list#name=twitter-adapter.dapplet-base.eth&title=Twitter%20adapter&version=v0.9.0). In our case we add image to the button and tooltip. `exec` is a function that runs on click. Now we just show the parsed contect in the console.


