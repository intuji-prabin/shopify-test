const BASE_URL = 'https://casual-mink-routinely.ngrok-free.app/api';

export const ENDPOINT = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    CREATE: '/user/create',
    GET: '/user/get',
    GET_ALL: '/user/get-all',
    UPDATE: '/user/update',
    DELETE: '/user/delete',
  },
  ROLE: {
    GET: `${BASE_URL}/customer-roles`,
  },
  FILE: {
    POST: `${BASE_URL}/customer-image/upload`,
  },
  PERMISSION: {
    CREATE: '/permission/create',
    GET: '/permission/get',
    GET_ALL: '/permission/get-all',
    UPDATE: '/permission/update',
    DELETE: '/permission/delete',
  },
  CATEGORY: {
    CREATE: '/category/create',
    GET: '/category/get',
    GET_ALL: '/category/get-all',
    UPDATE: '/category/update',
    DELETE: '/category/delete',
  },
  PRODUCT: {
    CREATE: '/product/create',
    GET: '/product/get',
    GET_ALL: '/product/get-all',
    UPDATE: '/product/update',
    DELETE: '/product/delete',
  },
  ORDER: {
    CREATE: '/order/create',
    GET: '/order/get',
    GET_ALL: '/order/get-all',
    UPDATE: '/order/update',
    DELETE: '/order/delete',
  },
  CART: {
    CREATE: '/cart/create',
    GET: '/cart/get',
    GET_ALL: '/cart/get-all',
    UPDATE: '/cart/update',
    DELETE: '/cart/delete',
  },
  REVIEW: {
    CREATE: '/review/create',
    GET: '/review/get',
    GET_ALL: '/review/get-all',
    UPDATE: '/review/update',
    DELETE: '/review/delete',
  },
  ADDRESS: {
    CREATE: '/address/create',
    GET: '/address/get',
    GET_ALL: '/address/get-all',
    UPDATE: '/address/update',
    DELETE: '/address/delete',
  },
  PAYMENT: {
    CREATE: '/payment/create',
    GET: '/payment/get',
    GET_ALL: '/payment/get-all',
    UPDATE: '/payment/update',
    DELETE: '/payment/delete',
  },
  SHIPPING: {
    CREATE: '/shipping/create',
    GET: '/shipping/get',
    GET_ALL: '/shipping/get-all',
  },
  ADMIN: {
    URL: 'https://intuji-test.myshopify.com/admin/api/2024-01/graphql.json',
  },
  CUSTOM: {
    URL: 'https://casual-mink-routinely.ngrok-free.app/api',
    CATEGORY_URL:
      'https://casual-mink-routinely.ngrok-free.app/api/product/category',
    PROMOTIONS:
      'https://casual-mink-routinely.ngrok-free.app/api/content-management?company_id=',
  },
};
