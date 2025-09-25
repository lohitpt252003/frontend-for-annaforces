import { get, set, del } from 'idb-keyval';

export const idbGet = async (key) => {
  try {
    return await get(key);
  } catch (error) {
    console.error('Error getting from idb:', error);
    return null;
  }
};

export const idbSet = async (key, value) => {
  try {
    await set(key, value);
  } catch (error) {
    console.error('Error setting to idb:', error);
  }
};

export const idbDel = async (key) => {
  try {
    await del(key);
  } catch (error) {
    console.error('Error deleting from idb:', error);
  }
};
