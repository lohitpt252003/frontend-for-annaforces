import { idbGet, idbSet, idbDel } from './idb';

const CACHE_PREFIX = 'problem_detail_';

export const getCachedProblemDetail = async (problemId) => {
  return await idbGet(`${CACHE_PREFIX}${problemId}`);
};

export const cacheProblemDetail = async (problemId, data) => {
  await idbSet(`${CACHE_PREFIX}${problemId}`, data);
};

export const clearProblemDetailCache = async (problemId) => {
  await idbDel(`${CACHE_PREFIX}${problemId}`);
};
