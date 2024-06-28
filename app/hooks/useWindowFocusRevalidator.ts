import {useRevalidator} from '@remix-run/react';
import {useEffect} from 'react';

export function useWindowFocusRevalidator() {
  const revalidater = useRevalidator();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        revalidater.revalidate();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}
