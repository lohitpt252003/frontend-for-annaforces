const CACHE_PREFIX = 'problem_detail_';

export const getCachedProblemDetail = (problemId) => {
  const cachedData = localStorage.getItem(`${CACHE_PREFIX}${problemId}`);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  return null;
};

export const cacheProblemDetail = (problemId, data) => {
  localStorage.setItem(`${CACHE_PREFIX}${problemId}`, JSON.stringify(data));
};

export const clearProblemDetailCache = (problemId) => {
  localStorage.removeItem(`${CACHE_PREFIX}${problemId}`);
};