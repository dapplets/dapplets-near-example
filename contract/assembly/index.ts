import { PersistentUnorderedMap, Context } from 'near-sdk-core';

// MODELS

const tweetsByNearId = new PersistentUnorderedMap<string, string[]>('a');

// READ

/**
 * Retrieves an array of tweets for given NEAR Account ID
 * @param nearId NEAR Account ID
 * @returns Array of tweets
 */
export function getTweets(nearId: string): string[] {
  return tweetsByNearId.contains(nearId) ? tweetsByNearId.getSome(nearId) : [];
}

// WRITE

/**
 * Adds tweet for NEAR Account ID
 * @param tweet
 */
export function addTweet(tweet: string): void {
  _insert(tweetsByNearId, Context.sender, tweet);
}

/**
 * Removes tweet for NEAR Account ID
 * @param tweet
 */
export function removeTweet(tweet: string): void {
  _delete(tweetsByNearId, Context.sender, tweet);
}

/**
 * Clears all storage of the contract (for development stage)
 */
export function clearAll(): void {
  tweetsByNearId.clear();
}

// HELPERS

/**
 * Inserts value to array stored in a map, if value is not exist
 * @param map Map where to insert the value
 * @param key Key in a map, by which array is stored
 * @param value Value to be added to array
 */
function _insert(map: PersistentUnorderedMap<string, string[]>, key: string, value: string): void {
  if (!map.contains(key)) map.set(key, [value]);

  const arr = map.getSome(key);

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == value) return;
  }

  arr.push(value);
  map.set(key, arr);
}

/**
 * Deletes value from array stored in a map, if value is exist
 * @param map Map where to delete the value
 * @param key Key in a map, by which array is stored
 * @param value Value to be removed from array
 */
function _delete(map: PersistentUnorderedMap<string, string[]>, key: string, value: string): void {
  if (!map.contains(key)) return;

  const arr = map.getSome(key);

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == value) {
      arr[i] = arr[arr.length - 1];
      arr.pop();
      break;
    }
  }

  map.set(key, arr);
}
