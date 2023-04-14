import moment from 'moment';

export const formateReportDate = (date: Date): string => {
  return moment(date).format('YYYY-MM-DD HH:mm');
};

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
const isObject = (item: any) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export const mergeDeep = (target: any, ...sources: any[]): any => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
