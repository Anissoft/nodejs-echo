import { useEffect, useState } from 'react';

const isQueryMatches = (query: string): boolean => {
  return window.matchMedia(query).matches;
};

export function useMediaQuery(query: string): boolean {
  const [isMatches, setIsMatches] = useState(isQueryMatches(query));

  useEffect(() => {
    const matchMedia = window.matchMedia(query);
    const updateMatches = () => {
      setIsMatches(isQueryMatches(query));
    };

    updateMatches();
    matchMedia.addEventListener('change', updateMatches);

    return () => {
      matchMedia.removeEventListener('change', updateMatches);
    };
  }, [query]);

  return isMatches;
}
