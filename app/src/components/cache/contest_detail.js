import { idbGet, idbSet, idbDel } from './idb';

const CONTEST_DETAIL_CACHE_KEY_PREFIX = 'contestDetailCache_';
const CACHE_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

export const getCachedContestDetail = async (contestId) => {
  const cacheKey = CONTEST_DETAIL_CACHE_KEY_PREFIX + contestId;
  const cachedData = await idbGet(cacheKey);
  if (cachedData) {
    const { timestamp, contest } = cachedData;
    if (Date.now() - timestamp < CACHE_EXPIRATION_TIME) {
      return contest;
    } else {
      await idbDel(cacheKey);
    }
  }
  return null;
};

export const cacheContestDetail = async (contestId, contest) => {
  const cacheKey = CONTEST_DETAIL_CACHE_KEY_PREFIX + contestId;
  const dataToCache = {
    timestamp: Date.now(),
    contest,
  };
  await idbSet(cacheKey, dataToCache);
};

export const clearContestDetailCache = async (contestId) => {
  const cacheKey = CONTEST_DETAIL_CACHE_KEY_PREFIX + contestId;
  await idbDel(cacheKey);
};
