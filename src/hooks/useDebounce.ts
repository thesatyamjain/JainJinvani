import { useState, useEffect } from 'react';

/**
 * A custom hook that delays the update of a value until after a specified delay has passed
 * since the last time the value was updated. Useful for debouncing rapid inputs.
 *
 * @param value The value to debounce.
 * @param delay The delay in milliseconds. Defaults to 300ms.
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
