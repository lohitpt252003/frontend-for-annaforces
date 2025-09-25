import { idbGet, idbSet, idbDel } from './idb';

const CACHE_PREFIX = 'submission_';

export const getCachedSubmission = async (submissionId) => {
  return await idbGet(`${CACHE_PREFIX}${submissionId}`);
};

export const cacheSubmission = async (submissionId, data) => {
  await idbSet(`${CACHE_PREFIX}${submissionId}`, data);
};

export const clearSubmissionCache = async (submissionId) => {
  await idbDel(`${CACHE_PREFIX}${submissionId}`);
};