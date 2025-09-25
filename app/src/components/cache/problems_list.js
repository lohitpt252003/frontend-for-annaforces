import { idbGet, idbSet, idbDel } from './idb';

const CACHE_KEY = 'problems_list';

export const getCachedProblems = async () => {
  return await idbGet(CACHE_KEY);
};

export const cacheProblems = async (data) => {
  await idbSet(CACHE_KEY, data);
};

export const clearProblemsCache = async () => {
  await idbDel(CACHE_KEY);
};
