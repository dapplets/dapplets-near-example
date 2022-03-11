import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Image } from 'semantic-ui-react';
import Bridge, { IDappStateProps } from '@dapplets/dapplet-overlay-bridge';

interface ITweet {
  authorFullname: string
  authorUsername?: string
  authorImg: string
  id: string
  text: string
}

export interface IState {
  nearAccount: string
  parsedCtx?: ITweet
}

interface IDappletApi {
  connectWallet: () => Promise<string>
  disconnectWallet: () => Promise<void>
  isWalletConnected: () => Promise<boolean>
  getCurrentNearAccount: () => Promise<string>
  getTweets: (nearId: string) => Promise<string[]>
  addTweet: (tweet: string) => Promise<void>
  removeTweet: (tweet: string) => Promise<void>
}

const dapplet = new Bridge<IDappletApi>();

export default (props: IDappStateProps<IState>) => {
  const { commonState, changeState } = props;

  if (!commonState.all) return <></>;

  const { nearAccount, parsedCtx } = commonState.all;
  // console.log('commonState', commonState)
  // console.log('nearAccount', nearAccount)
  // console.log('parsedCtx', parsedCtx)

  const [savedTweets, setSavedTweets] = useState<string[]>();

  useEffect(() => {
    if (commonState.all === undefined || commonState.all.nearAccount === '') {
      setSavedTweets(undefined);
    } else {
      dapplet.getTweets(commonState.all.nearAccount).then(x => setSavedTweets(x));
    }
  }, [props.commonState.all.nearAccount]);

  const handleSaveTweet = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const stringifiedCtx = JSON.stringify(parsedCtx);
    if (savedTweets?.includes(stringifiedCtx)) return;
    try {
      await dapplet.addTweet(stringifiedCtx);
    } catch (err) {
      console.log('Error in handleSaveTweet().', err)
    }

    let tweets: string[] | undefined = undefined;
    if (nearAccount) tweets = await dapplet.getTweets(nearAccount);
    setSavedTweets(tweets);
  };

  const handleDeleteTweet = (ctx: string) => async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await dapplet.removeTweet(ctx);
    } catch (err) {
      console.log('Error in handleDeleteTweet().', err)
    }
    let tweets: string[] | undefined = undefined;
    if (nearAccount) tweets = await dapplet.getTweets(nearAccount);
    setSavedTweets(tweets);
  };

  const handleLogin = async () => {
    try {
      const isWalletConnected = await dapplet.isWalletConnected();
      let accountName: string;
      if (!isWalletConnected) {
        accountName = await dapplet.connectWallet();
      } else {
        accountName = await dapplet.getCurrentNearAccount();
      }
      changeState?.({ nearAccount: accountName });
      let tweets: string[] | undefined = undefined;
      if (accountName) tweets = await dapplet.getTweets(accountName);
      setSavedTweets(tweets);
    } catch (err) {
      console.log('ERROR while login:', err)
    }
  };

  const handleLogout = async () => {
    try {
      const isWalletConnected = await dapplet.isWalletConnected();
      if (isWalletConnected) {
        await dapplet.disconnectWallet();
      }
      changeState?.({ nearAccount: '' });
      setSavedTweets(undefined);
    } catch (err) {
      console.log('ERROR while logout:', err)
    }
  };

  return (
    <>
      <header style={{ justifyContent: nearAccount ? 'space-between' : 'center' }}>
        {!nearAccount ? (
          <Button
            basic
            color='red'
            className='login'
            onClick={handleLogin}
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
              onClick={handleLogout}
            >
              Log out
            </Button>
          </>
        )}
      </header>

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
              <Card.Content extra>
                <Button
                  disabled={!nearAccount || savedTweets?.includes(JSON.stringify(parsedCtx))}
                  onClick={handleSaveTweet}
                >
                  Save to NEAR
                </Button>
              </Card.Content>
            </Card>
          </>
        )}

        {savedTweets && savedTweets.length > 0 && (
          <>
            <h4>
              Saved Tweets:
            </h4>
            {savedTweets.map((savedTweet, i) => {
              const tweetData: ITweet = JSON.parse(savedTweet);
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
        )}
      </main>
    </>
  );
};
