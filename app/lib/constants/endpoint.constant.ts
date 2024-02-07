const BASE_URL = 'https://casual-mink-routinely.ngrok-free.app/api';
const ADMIN_URL = 'https://relaxing-hawk-ace.ngrok-free.app/api';
export const ENDPOINT = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  ROLE: {
    GET: `${BASE_URL}/customer-roles`,
  },
  FILE: {
    POST: `${BASE_URL}/customer-image/upload`,
  },
  CUSTOMER: {
    GET: `${ADMIN_URL}/customer`,
    PUT: `${ADMIN_URL}/customer-status`,
  },
  CUSTOMER_LIST: {
    GET: `${ADMIN_URL}/customer-list`,
  },
  CUSTOM: {
    URL: 'https://casual-mink-routinely.ngrok-free.app/api',
  },
};
