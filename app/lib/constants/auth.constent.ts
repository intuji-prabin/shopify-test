export const USER_STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  BLOCKED: 'blocked',
});

export enum UserRole {
  SUPER_ADMIN,
  ADMIN,
  REGULAR,
}

export const TOAST_MESSAGE_SECRET =
  'kUeIaDWyg3EVwOK2nQQGTjN7APOcyLaEB+skRb4UL1M=';

export const FILTER_SECRET = 'xDp9mIeQz8FrSvT6uBwGvCf3LeJ2WoN1M+kyHd4gU5E=';

export const USER_DETAILS_SESSION_SECRET =
  'iFaXBRJ6HzfoNgOLmtwKudAVHyIfsYrRtNMxFZ7PI4M=';

export const ADMIN_ACCESS_TOKEN = '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';

export const SESSION_MAX_AGE = {
  '30_DAYS': 60 * 60 * 24 * 30,
  '7_DAYS': 60 * 60 * 24 * 7,
};
