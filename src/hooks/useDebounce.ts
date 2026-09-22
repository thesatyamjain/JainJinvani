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
    // Update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if the value changes or the component unmounts
    // This ensures that the timeout is reset on rapid inputs
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
