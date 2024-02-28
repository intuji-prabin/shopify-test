// const BASE_URL = 'https://casual-mink-routinely.ngrok-free.app/api';  // Sanchay NGRok

// const BASE_URL = 'https://relaxing-hawk-ace.ngrok-free.app/api'; // Amit NGRok

const BASE_URL = 'https://cig-backend.webo.dev/api'; // Live

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
    POST: `https://casual-mink-routinely.ngrok-free.app/api/customer-image`,
  },
  CUSTOMER: {
    GET: `${BASE_URL}/customer`,
    UPDATE_STATUS: `${BASE_URL}/customer-status`,
    CREATE: `${BASE_URL}/customer`,
    UPDATE: `${BASE_URL}/customer-update`,
  },
  CUSTOMER_LIST: {
    GET: `${BASE_URL}/customer`,
  },
  COMPANY: {
    GET_PROFILE: `${BASE_URL}/company`,
    GET_SHIPPING_ADDRESS: `${BASE_URL}/company/shipping-address`,
  },
  CATEGORY: {
    GET: `${BASE_URL}/product/category`,
    GET_DETAIL: `${BASE_URL}/product/category/detail`,
  },
  PROMOTION: {
    GET: `${BASE_URL}/promotions`,
    GET_MYPROMOTION: `${BASE_URL}/mypromotion`,
    BULK_DELETE: `${BASE_URL}/promotions`,
    BULK_EXPORT: `${BASE_URL}/promotion/download-images`,
  },
  SUPPORT: {
    GET_TICKETS: `${BASE_URL}/support/tickets`,
    CREATE_TICKET: `${BASE_URL}/support/create-ticket`,
  },
  PRODUCT: {
    GET_PRICE: `${BASE_URL}/product/prices`,
  },
};
