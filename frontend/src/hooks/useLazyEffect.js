import { useEffect, useRef } from 'react';

function useLazyEffect(callback, dependencies, skipIterations = 1) {
  const refIterations = useRef(0);

  useEffect(function () {
    if (++refIterations.current <= skipIterations) {
      return;
    }

    return callback();
  }, dependencies);
}

export default useLazyEffect;
