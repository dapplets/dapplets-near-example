import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Image } from 'semantic-ui-react';
import { bridge } from './dappletBridge';

interface ICtx {
  authorFullname: string
  authorUsername?: string
  authorImg: string
  id: string
  text: string
}

export default () => {

  const [parsedCtx, setParsedCtx] = useState<ICtx>();
  //const [nearAccount, setNearAccount] = useState<string>();
  //const [savedTweets, setSavedTweets] = useState<string[]>();

  useEffect(() => {
    bridge.onData((data?: ICtx) => {
      setParsedCtx(data);
    });
    /* bridge.isWalletConnected().then(async(isWalletConnected) => {
      let accountName: string | undefined
      if (isWalletConnected) {
        accountName = await bridge.getCurrentNearAccount();
      }
      setNearAccount(accountName);

      let tweets: string[] | undefined = undefined;
      if (accountName) tweets = await bridge.getTweets(accountName);
      setSavedTweets(tweets);
    }); */
  }, []);

  /* const handleSaveTweet = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const stringifiedCtx = JSON.stringify(parsedCtx);
    if (savedTweets?.includes(stringifiedCtx)) return; 
    await bridge.addTweet(stringifiedCtx);
    let tweets: string[] | undefined = undefined;
    if (nearAccount) tweets = await bridge.getTweets(nearAccount);
    setSavedTweets(tweets);
  }

  const handleDeleteTweet = (ctx: string) => async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    await bridge.removeTweet(ctx);
    let tweets: string[] | undefined = undefined;
    if (nearAccount) tweets = await bridge.getTweets(nearAccount);
    setSavedTweets(tweets);
  } */

  return (
    <>
      {/* <header style={{ justifyContent: nearAccount ? 'space-between' : 'center' }}>
        {!nearAccount ? (
            <Button
              basic
              color='red'
              className='login'
              onClick={async () => {
                const isWalletConnected = await bridge.isWalletConnected();
                let accountName: string;
                if (!isWalletConnected) {
                  accountName = await bridge.connectWallet();
                } else {
                  accountName = await bridge.getCurrentNearAccount();
                }
                setNearAccount(accountName);
                let tweets: string[] | undefined = undefined;
                if (accountName) tweets = await bridge.getTweets(accountName);
                setSavedTweets(tweets);
              }}
            >
              Log in to my account
            </Button>
          ) : (
            <>
              <p style={{ fontSize: 16 }}>{nearAccount}</p>
              <Button
                basic
                color='red'
                className='logout'
                onClick={async () => {
                  const isWalletConnected = await bridge.isWalletConnected();
                  if (isWalletConnected) {
                    await bridge.disconnectWallet();
                  }
                  setNearAccount(undefined);
                  setSavedTweets(undefined);
                }}
              >
                Log out
              </Button>
            </>)}
      </header> */}

      <main>
        <div className='title'>
          <h1>DAPPLETS × NEAR</h1>
          <h2>example</h2>
        </div>
        <Divider style={{ margin: '20px 0 0' }} />
        {/* Semantic UI React element source: https://react.semantic-ui.com/views/card/#types-groups */}
        {parsedCtx && (
          <>
            <h4>
              Parsed Tweet:
            </h4>
            <Card fluid className='overlay-card'>
              <Card.Content>
                <Image
                  floated='right'
                  size='mini'
                  src={parsedCtx.authorImg}
                />
                <Card.Header>{parsedCtx.authorFullname}</Card.Header>
                {parsedCtx.authorUsername && <Card.Meta>@{parsedCtx.authorUsername}</Card.Meta>}
                <Card.Description>
                  {parsedCtx.text}
                </Card.Description>
              </Card.Content>
              {/* <Card.Content extra>
                  <Button
                    disabled={!nearAccount || savedTweets?.includes(JSON.stringify(parsedCtx))}
                    onClick={handleSaveTweet}
                  >
                    Save to NEAR
                  </Button>
              </Card.Content>*/}
            </Card>
          </>
        )}

        {/* {savedTweets && savedTweets.length > 0 && (
          <>
            <h4>
              Saved Tweets:
            </h4>
            {savedTweets.map((savedTweet, i) => {
              const tweetData: ICtx = JSON.parse(savedTweet);
              return (
                <Card key={i} fluid className='overlay-card'>
                  <Card.Content>
                    <Image
                      floated='right'
                      size='mini'
                      src={tweetData.authorImg}
                    />
                    <Card.Header>{tweetData.authorFullname}</Card.Header>
                    {tweetData.authorUsername && <Card.Meta>@{tweetData.authorUsername}</Card.Meta>}
                    <Card.Description>
                      {tweetData.text}
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                      <Button
                        disabled={!nearAccount}
                        onClick={handleDeleteTweet(savedTweet)}
                      >
                        Delete from NEAR
                      </Button>
                  </Card.Content>
                </Card>
              );
            })}
          </>
        )} */}
      </main>
    </>
  );
};
