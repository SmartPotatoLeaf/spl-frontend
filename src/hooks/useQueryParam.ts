import {useCallback, useEffect, useState} from 'react';

/**
 * useQueryParam - a small reusable hook to read and sync a single query param.
 * - key: the query param name
 * - defaultValue: the fallback value when param is absent or invalid
 * - validate?: optional type guard that validates the raw string value
 *
 * Returns a readonly tuple [value, setValue] where setValue accepts either a
 * direct value or an updater function like React's setState. When setting the
 * value, the URL is updated via history.replaceState (no reload).
 */
export default function useQueryParam<T extends string = string>(
  key: string,
  defaultValue: T,
  validate?: (v: string | null) => v is T
) {
  const [value, setValueState] = useState<T>(defaultValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get(key);
      if (validate) {
        if (validate(raw)) setValueState(raw);
      } else {
        if (raw !== null) setValueState(raw as T);
      }
    } catch {
      // ignore
    }
    // key and validate are stable enough here; re-run if they change
  }, [key, validate]);

  const setValue = useCallback(
    (next: React.SetStateAction<T>) => {
      setValueState(prev => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        if (typeof window !== 'undefined') {
          try {
            const url = new URL(window.location.href);
            url.searchParams.set(key, resolved);
            window.history.replaceState(null, '', url.toString());
          } catch {
            // ignore
          }
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, setValue] as const;
}

