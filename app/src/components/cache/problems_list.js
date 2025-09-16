const CACHE_KEY = 'problems_list';

export const getCachedProblems = () => {
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  return null;
};

export const cacheProblems = (data) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
};

export const clearProblemsCache = () => {
  localStorage.removeItem(CACHE_KEY);
};