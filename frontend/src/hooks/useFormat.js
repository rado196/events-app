import moment from 'moment';

function str2num(value) {
  if (!value) {
    return null;
  }

  const strVal = (value || '')
    .toString()
    .split('')
    .filter((char) => /^[\d.]$/.test(char))
    .join('');

  return Number(strVal);
}

function formatNumber(value, suffixLength = 1) {
  if (value !== 0) {
    value = str2num(value);
    if (!value) {
      return value;
    }
  }

  return Number((value || '').toString())
    .toFixed(suffixLength)
    .toString()
    .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

function formatDate(dateInstance) {
  if (typeof dateInstance === 'string') {
    dateInstance = new Date(dateInstance);
  }

  return moment(dateInstance).format('LLL');
}

function dateHumanize(dateInstance, withSuffix = true) {
  if (typeof dateInstance === 'string') {
    dateInstance = new Date(dateInstance);
  }

  const nowTimer = new Date().getTime();
  const actionTime = dateInstance.getTime();

  const diff = actionTime - nowTimer;

  return moment.duration(diff, 'milliseconds').humanize(withSuffix);
}

function useFormat() {
  return {
    number: formatNumber,
    date: formatDate,
    dateHumanize: dateHumanize,
  };
}

export default useFormat;
