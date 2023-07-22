import { useCallback, useRef } from 'react';

function useDebounced(callback, dependencies, timer = 300) {
  const refTimer = useRef();
  const debouncedCallback = useCallback(function (...args) {
    clearTimeout(refTimer.current);
    refTimer.current = setTimeout(function () {
      callback(...args);
    }, timer);
  }, dependencies);

  return debouncedCallback;
}

export default useDebounced;
