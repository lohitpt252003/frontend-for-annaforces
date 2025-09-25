import { idbGet, idbSet, idbDel } from './idb';

const CACHE_PREFIX = 'solution_';

export const getCachedSolution = async (problemId) => {
  return await idbGet(`${CACHE_PREFIX}${problemId}`);
};

export const cacheSolution = async (problemId, data) => {
  await idbSet(`${CACHE_PREFIX}${problemId}`, data);
};

export const clearSolutionCache = async (problemId) => {
  await idbDel(`${CACHE_PREFIX}${problemId}`);
};
