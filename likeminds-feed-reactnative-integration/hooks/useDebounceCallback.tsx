import { useCallback, useEffect } from 'react';
import _ from 'lodash';

export default function useDebouncedCallback(callback, delay) {
  const debouncedFn = useCallback(_.debounce(callback, delay), [callback, delay]);

  useEffect(() => {
    return () => {
      debouncedFn.cancel(); // Clean up on unmount
    };
  }, [debouncedFn]);

  return debouncedFn;
}