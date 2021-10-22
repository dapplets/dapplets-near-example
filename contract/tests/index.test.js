import 'regenerator-runtime/runtime';

let near;
let contract;
let accountId;

beforeAll(async function () {
  near = await nearlib.connect(nearConfig);
  accountId = nearConfig.contractName;
  contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: ['getTweets'],
    changeMethods: ['addTweet', 'removeTweet', 'clearAll'],
    sender: accountId,
  });
});

it('adds tweet', async () => {
  await contract.addTweet({ tweet: '{"id":"1443880454734614543","text":"Web3 is a web of moustaches","authorFullname":"Dapplets Project","authorUsername":"dappletsproject","authorImg":"https://pbs.twimg.com/profile_images/1440445047112044553/IrnYLJaG_normal.jpg","theme":"LIGHT","parent":null}' });
  await contract.addTweet({ tweet: '{"id":"1447632255845900291","text":"We are a true crypto project! Our augmentations are decentralized, unstoppable and permissionless.","authorFullname":"Dapplets Project","authorUsername":"dappletsproject","authorImg":"https://pbs.twimg.com/profile_images/1440445047112044553/IrnYLJaG_normal.jpg","theme":"LIGHT","parent":null}' });

  const tweets = await contract.getTweets({ nearId: accountId });

  expect(tweets).toMatchObject([
    '{"id":"1443880454734614543","text":"Web3 is a web of moustaches","authorFullname":"Dapplets Project","authorUsername":"dappletsproject","authorImg":"https://pbs.twimg.com/profile_images/1440445047112044553/IrnYLJaG_normal.jpg","theme":"LIGHT","parent":null}',
    '{"id":"1447632255845900291","text":"We are a true crypto project! Our augmentations are decentralized, unstoppable and permissionless.","authorFullname":"Dapplets Project","authorUsername":"dappletsproject","authorImg":"https://pbs.twimg.com/profile_images/1440445047112044553/IrnYLJaG_normal.jpg","theme":"LIGHT","parent":null}'
  ]);
});

it('removes tweet', async () => {
  await contract.addTweet({ tweet: '{"id":"1443880454734614543","text":"Web3 is a web of moustaches","authorFullname":"Dapplets Project","authorUsername":"dappletsproject","authorImg":"https://pbs.twimg.com/profile_images/1440445047112044553/IrnYLJaG_normal.jpg","theme":"LIGHT","parent":null}' });
  await contract.addTweet({ tweet: '{"id":"1447632255845900291","text":"We are a true crypto project! Our augmentations are decentralized, unstoppable and permissionless.","authorFullname":"Dapplets Project","authorUsername":"dappletsproject","authorImg":"https://pbs.twimg.com/profile_images/1440445047112044553/IrnYLJaG_normal.jpg","theme":"LIGHT","parent":null}' });

  await contract.removeTweet({ tweet: '{"id":"1443880454734614543","text":"Web3 is a web of moustaches","authorFullname":"Dapplets Project","authorUsername":"dappletsproject","authorImg":"https://pbs.twimg.com/profile_images/1440445047112044553/IrnYLJaG_normal.jpg","theme":"LIGHT","parent":null}' });

  const tweets = await contract.getTweets({ nearId: accountId });

  expect(tweets).toMatchObject(['{"id":"1447632255845900291","text":"We are a true crypto project! Our augmentations are decentralized, unstoppable and permissionless.","authorFullname":"Dapplets Project","authorUsername":"dappletsproject","authorImg":"https://pbs.twimg.com/profile_images/1440445047112044553/IrnYLJaG_normal.jpg","theme":"LIGHT","parent":null}']);
});

it('clears all', async () => {
  await contract.addTweet({ tweet: '{"id":"1443880454734614543","text":"Web3 is a web of moustaches","authorFullname":"Dapplets Project","authorUsername":"dappletsproject","authorImg":"https://pbs.twimg.com/profile_images/1440445047112044553/IrnYLJaG_normal.jpg","theme":"LIGHT","parent":null}' });
  await contract.addTweet({ tweet: '{"id":"1447632255845900291","text":"We are a true crypto project! Our augmentations are decentralized, unstoppable and permissionless.","authorFullname":"Dapplets Project","authorUsername":"dappletsproject","authorImg":"https://pbs.twimg.com/profile_images/1440445047112044553/IrnYLJaG_normal.jpg","theme":"LIGHT","parent":null}' });

  await contract.clearAll();

  const tweets = await contract.getTweets({ nearId: accountId });

  expect(tweets).toMatchObject([]);
});
