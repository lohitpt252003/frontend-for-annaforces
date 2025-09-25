import { idbGet, idbSet, idbDel } from './idb';

const CONTESTS_CACHE_KEY = 'contestsCache';
const CACHE_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

export const getCachedContests = async () => {
  const cachedData = await idbGet(CONTESTS_CACHE_KEY);
  if (cachedData) {
    const { timestamp, allContests } = cachedData;
    if (Date.now() - timestamp < CACHE_EXPIRATION_TIME) {
      return { allContests };
    } else {
      await idbDel(CONTESTS_CACHE_KEY);
    }
  }
  return null;
};

export const cacheContests = async ({ allContests }) => {
  const dataToCache = {
    timestamp: Date.now(),
    allContests,
  };
  await idbSet(CONTESTS_CACHE_KEY, dataToCache);
};

export const clearContestsCache = async () => {
  await idbDel(CONTESTS_CACHE_KEY);
};
