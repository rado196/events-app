function usePagination(lastPage, currentPage, delta = 2, dots = '...') {
  const left = currentPage - delta;
  const right = currentPage + delta + 1;
  const range = [];
  const rangeWithDots = [];

  for (let i = 1; i <= lastPage; ++i) {
    if (i === 1 || i === lastPage || (i >= left && i < right)) {
      range.push(i);
    }
  }

  let index;
  for (let i of range) {
    if (index) {
      if (i - index === 2) {
        rangeWithDots.push(index + 1);
      } else if (i - index !== 1) {
        rangeWithDots.push(dots);
      }
    }
    rangeWithDots.push(i);
    index = i;
  }

  return rangeWithDots;
}

export default usePagination;
