import { he } from "date-fns/locale";

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

export const USER_DETAILS_SESSION_SECRET =
  'iFaXBRJ6HzfoNgOLmtwKudAVHyIfsYrRtNMxFZ7PI4M=';

export const ADMIN_ACCESS_TOKEN = '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';

export const SESSION_MAX_AGE = {
  '30_DAYS': 60 * 60 * 24 * 30,
  '7_DAYS': 60 * 60 * 24 * 7,
};

export const FILTER_SECRET = 'reueBmScUt29/V9J77k9Qj3gWsG0miX7928+D4s78AI=';

export const Permission_API_Credential = {
  headerKey: 'X-Shopify-Permission-Token',
  headerValue: 'iFaXBRJ6HzfoNgOLmtwKudAVHyIfsYrRtNMxFZ7PI4M=',
  url: 'https://cig-backend.webo.dev',
};
