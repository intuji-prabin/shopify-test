import {useMemo, useEffect} from 'react';
import NProgress from 'nprogress';
import {useFetchers, useNavigation} from '@remix-run/react';

/**
 * @description Custom hooks for the global page loader
 */
export function useGlobalLoader() {
  const navigation = useNavigation();

  const fetchers = useFetchers();

  /**
   * This gets the state of every fetcher active on the app and combine it with
   * the state of the global navigation (Link and Form), then use them to
   * determine if the app is idle or if it's loading.
   * Here we consider both loading and submitting as loading.
   */
  const state = useMemo<'idle' | 'loading'>(
    function getGlobalState() {
      let states = [
        navigation.state,
        ...fetchers.map((fetcher) => fetcher.state),
      ];
      if (states.every((state) => state === 'idle')) return 'idle';
      return 'loading';
    },
    [navigation.state, fetchers],
  );

  useEffect(() => {
    // and when it's something else it means it's either submitting a form or
    // waiting for the loaders of the next location so we start it
    if (state === 'loading') NProgress.start();
    // when the state is idle then we can to complete the progress bar
    if (state === 'idle') NProgress.done();
  }, [navigation.state]);
}
