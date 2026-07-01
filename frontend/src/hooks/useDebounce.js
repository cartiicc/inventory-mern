import { useState, useEffect } from 'react';

/**
 * Debounces a value — used for search inputs to avoid firing an API
 * call on every keystroke.
 */
export const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
