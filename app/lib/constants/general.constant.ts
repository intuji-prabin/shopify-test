// API response status
export const HTTP_STATUS = Object.freeze({
  PENDING: 'pending',
  SUCCESS: 'success',
  REJECTED: 'rejected',
});

// Local storage keys
export const LOCAL_STORAGE_KEYS = Object.freeze({
  ACCESSTOKEN: 'accessToken',
});

// Default image placeholder
export const DEFAULT_IMAGE = Object.freeze({
  USER: '/images/dummyuser.svg',
  LOGO: '/images/dummylogo.svg',
  DEFAULT:
    'https://shermacbucket.sgp1.digitaloceanspaces.com/DefaultImages/IMG_378943359_ic_admin_user_default.svg',
});

// Pagination
export const PAGINATION = Object.freeze({
  PAGE: 1,
  LIMIT: 10,
});
