const CACHE_PREFIX = 'submission_';

export const getCachedSubmission = (submissionId) => {
  const cachedData = localStorage.getItem(`${CACHE_PREFIX}${submissionId}`);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  return null;
};

export const cacheSubmission = (submissionId, data) => {
  localStorage.setItem(`${CACHE_PREFIX}${submissionId}`, JSON.stringify(data));
};
