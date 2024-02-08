// const BASE_URL = 'https://casual-mink-routinely.ngrok-free.app/api';  // Sanchay NGRok

const BASE_URL = 'https://relaxing-hawk-ace.ngrok-free.app/api'; // Amit NGRok

export const ENDPOINT = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  ROLE: {
    GET: `https://casual-mink-routinely.ngrok-free.app/api/customer-roles`,
  },
  FILE: {
    POST: `https://casual-mink-routinely.ngrok-free.app/api/customer-image/upload`,
  },
  CUSTOMER: {
    GET: `${BASE_URL}/customer`,
    UPDATE_STATUS: `${BASE_URL}/customer-status`,
    CREATE: `${BASE_URL}/customer-create`,
    UPDATE: `${BASE_URL}/customer-update`,
  },
  CUSTOMER_LIST: {
    GET: `${BASE_URL}/customer-list`,
  },
  COMPANY: {
    GET_PROFILE: `${BASE_URL}/company-profile`,
    GET_SHIPPING_ADDRESS: `${BASE_URL}/company/shipping-address`,
  },
  CUSTOM: {
    URL: 'https://casual-mink-routinely.ngrok-free.app/api',
  },
};
