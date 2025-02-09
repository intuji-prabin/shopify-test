import {PERMISSIONS} from '../helpers/roles';

// API response status
export const HTTP_STATUS = Object.freeze({
  PENDING: 'pending',
  SUCCESS: 'success',
  REJECTED: 'rejected',
});

// Local storage keys
export const LOCAL_STORAGE_KEYS = Object.freeze({
  ACCESSTOKEN: 'accessToken',
  PERMISSIONS: 'permissions',
});

// Default image placeholder
export const DEFAULT_IMAGE = Object.freeze({
  USER: '/images/dummyuser.svg',
  LOGO: '/images/dummylogo.svg',
  IMAGE: '/dummy_image.png',
  DEFAULT: '/default-user.svg',
});

// Pagination
export const PAGINATION = Object.freeze({
  PAGE: 1,
  LIMIT: 9,
});

export const TRACK_AN_ORDERID = 'trackAnOrderId';
