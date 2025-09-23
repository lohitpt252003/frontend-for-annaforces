const CONTEST_DETAIL_CACHE_KEY_PREFIX = 'contestDetailCache_';
const CACHE_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

export const getCachedContestDetail = (contestId) => {
  const cacheKey = CONTEST_DETAIL_CACHE_KEY_PREFIX + contestId;
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    const { timestamp, contest } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_EXPIRATION_TIME) {
      return contest;
    } else {
      localStorage.removeItem(cacheKey);
    }
  }
  return null;
};

export const cacheContestDetail = (contestId, contest) => {
  const cacheKey = CONTEST_DETAIL_CACHE_KEY_PREFIX + contestId;
  const dataToCache = {
    timestamp: Date.now(),
    contest,
  };
  localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
};

export const clearContestDetailCache = (contestId) => {
  const cacheKey = CONTEST_DETAIL_CACHE_KEY_PREFIX + contestId;
  localStorage.removeItem(cacheKey);
};