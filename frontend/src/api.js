import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API,
  timeout: 4000,
});

export default instance;

export function mergeFilterAndPagination(filter, pagination) {
  const result = {};

  const manipulate = function (prefix, items) {
    Object.keys(items).forEach(function (key) {
      result[`${prefix}.${key}`] = items[key];
    });
  };

  manipulate('flt', filter || {});
  manipulate('pg', pagination || {});

  return result;
}
