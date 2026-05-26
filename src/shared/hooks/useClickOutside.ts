import { RefObject, useEffect } from 'react';

export const useClickOutside = (
  ref: RefObject<HTMLElement>,
  handler: () => void,
  enabled = true,
) => {
  useEffect(() => {
    if (!enabled) return;

    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', listener);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', listener);
    };
  }, [enabled]);
};
