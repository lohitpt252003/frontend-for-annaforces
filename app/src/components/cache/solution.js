const CACHE_PREFIX = 'solution_';

export const getCachedSolution = (problemId) => {
  const cachedData = localStorage.getItem(`${CACHE_PREFIX}${problemId}`);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  return null;
};

export const cacheSolution = (problemId, data) => {
  localStorage.setItem(`${CACHE_PREFIX}${problemId}`, JSON.stringify(data));
};

export const clearSolutionCache = (problemId) => {
  localStorage.removeItem(`${CACHE_PREFIX}${problemId}`);
};