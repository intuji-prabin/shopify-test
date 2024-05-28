// const BASE_URL = 'http://170.64.130.119:3000/api'; //test 1
const BASE_URL = 'https://cig-backuat.webo.dev/api'; //test 1

export const ENDPOINT = {
  REPORT: {
    GET: `${BASE_URL}/order/report`,
    PRODUCT_GET: `${BASE_URL}/product/report`,
  },
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    SESSION: `${BASE_URL}/session`,
  },
  ROLE: {
    GET: `${BASE_URL}/customer-roles`,
  },
  FILE: {
    POST: `${BASE_URL}/customer-image`,
  },
  CUSTOMER: {
    GET: `${BASE_URL}/customer`,
    UPDATE_STATUS: `${BASE_URL}/customer-status`,
    CREATE: `${BASE_URL}/customer`,
    UPDATE: `${BASE_URL}/customer-update`,
    ACTIVATE: `${BASE_URL}/customer/activate`,
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
    TICKETS: `${BASE_URL}/support/tickets`,
  },
  PRODUCT: {
    GET_PRICE: `${BASE_URL}/product/prices`,
    GET_PRODUCT: `${BASE_URL}/product`,
    CART: `${BASE_URL}/cart-session`,
    CART_DETAIL: `${BASE_URL}/cart-detail`,
    ORDER: `${BASE_URL}/order`,
    FILTER: `${BASE_URL}/product/filter`,
  },
  BULK: {
    GET_PRODUCT: `${BASE_URL}/bulk/product-id`,
  },
  WISHLIST: {
    ADD: `${BASE_URL}/wishlist`,
  },
  ORDERS: {
    GET: `${BASE_URL}/order`,
    GET_ORDER_DETAIL: `${BASE_URL}/order-detail`,
    EXPORT: `${BASE_URL}/download/orders`,
  },
  PENDING_ORDERS: {
    PRODUCT_GROUP: `${BASE_URL}/product/group`,
    PRODUCT_GROUP_ITEM: `${BASE_URL}/product-group/items`,
  },
  PLACE_AN_ORDER: `${BASE_URL}/place-an-order`,
  INVOICE: {
    GET: `${BASE_URL}/invoices`,
    GET_INVOCIE_DETAIL: `${BASE_URL}/invoice`,
    EXPORT: `${BASE_URL}/download/invoice`,
  },
  STATEMENT: {
    GET: `${BASE_URL}/statement`,
  },
  PROMO_CODE: {
    POST: `${BASE_URL}/promo-code`,
  },
  NOTIFICATIONS: {
    GET: `${BASE_URL}/notifications`,
  },
};
