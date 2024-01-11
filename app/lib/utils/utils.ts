import {useLocation} from '@remix-run/react';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {useMemo} from 'react';
import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function useVariantUrl(
  handle: string,
  selectedOptions: SelectedOption[],
) {
  const {pathname} = useLocation();

  return useMemo(() => {
    return getVariantUrl({
      handle,
      pathname,
      searchParams: new URLSearchParams(),
      selectedOptions,
    });
  }, [handle, selectedOptions, pathname]);
}

export function getVariantUrl({
  handle,
  pathname,
  searchParams,
  selectedOptions,
}: {
  handle: string;
  pathname: string;
  searchParams: URLSearchParams;
  selectedOptions: SelectedOption[];
}) {
  const match = /(\/[a-zA-Z]{2}-[a-zA-Z]{2}\/)/g.exec(pathname);
  const isLocalePathname = match && match.length > 0;

  const path = isLocalePathname
    ? `${match![0]}products/${handle}`
    : `/products/${handle}`;

  selectedOptions.forEach((option) => {
    searchParams.set(option.name, option.value);
  });

  const searchString = searchParams.toString();

  return path + (searchString ? '?' + searchParams.toString() : '');
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * @param {Function} func
 * @param {number} delay
 * @param {{ leading?: boolean }} options
 */
export function debounce(
  // eslint-disable-next-line @typescript-eslint/ban-types
  func: Function,
  delay: number,
  {leading}: {leading?: boolean} = {},
) {
  //@ts-ignore
  let timerId: NodeJS.Timeout | null;

  return (...args: any[]) => {
    if (!timerId && leading) {
      func(...args);
    }
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => func(...args), delay);
  };
}
