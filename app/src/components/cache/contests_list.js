const CONTESTS_CACHE_KEY = 'contestsCache';
const CACHE_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

export const getCachedContests = () => {
  const cachedData = localStorage.getItem(CONTESTS_CACHE_KEY);
  if (cachedData) {
    const { timestamp, allContests } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_EXPIRATION_TIME) {
      return { allContests };
    } else {
      localStorage.removeItem(CONTESTS_CACHE_KEY);
    }
  }
  return null;
};

export const cacheContests = ({ allContests }) => {
  const dataToCache = {
    timestamp: Date.now(),
    allContests,
  };
  localStorage.setItem(CONTESTS_CACHE_KEY, JSON.stringify(dataToCache));
};

export const clearContestsCache = () => {
  localStorage.removeItem(CONTESTS_CACHE_KEY);
};