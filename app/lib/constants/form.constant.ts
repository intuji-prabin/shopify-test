// form field max length
export const MAX_LENGTH = Object.freeze({
  NAME: 64,
  FIRST_NAME: 32,
  LAST_NAME: 32,
  EMAIL: 32,
  PHONE: 15,
  URL: 255,
  MESSAGE: 10000,
  COMPANY: 32,
  ADDRESS: 255,
  CITY: 255,
  STATE: 32,
  POSTAL_CODE: 12,
  PASSWORD: 255,
  CART_ITEMS: 9999,
  DEFAULT: 255,
});

// form field min length
export const MIN_LENGTH = Object.freeze({
  DEFAULT: 1,
});

// Supported file types for upload
export const supportedTypes: string[] = [
  'jpeg',
  'png',
  'pdf',
  'jpg',
  'docx',
  'txt',
  'doc',
];

// Supported image types for upload
export const supportedImageTypes: string[] = ['jpeg', 'png', 'jpg', 'webp'];

// supported pdf types for upload
export const supportedPdfTypes: string[] = ['pdf'];

// supported document types for upload
export const supportedDocumentTypes: string[] = ['docx', 'txt', 'doc'];

// supported video types for upload
export const supportedVideoTypes: string[] = ['mp4', 'webm'];

// File upload
export const MessageConstant = {
  default: {
    required: 'This field is required',
    invalid: 'Invalid input',
    maxLength:
      'This field cannot be more than ' + MAX_LENGTH.DEFAULT + ' characters.',
  },
  name: {
    required: 'Please enter your full name',
    invalid: 'Name can only contain letters, dashes, underscores and spaces.',
    maxLength: 'Name must be less than ' + MAX_LENGTH.NAME + ' characters.',
  },
  firstName: {
    required: 'Please enter your first name',
    invalid:
      'First name can only contain letters, dashes, underscores and spaces.',
    maxLength:
      'First name must be less than ' + MAX_LENGTH.FIRST_NAME + ' characters.',
  },
  lastName: {
    required: 'Please enter your last name',
    invalid:
      'Last name can only contain letters, dashes, underscores and spaces.',
    maxLength:
      'Last name must be less than ' + MAX_LENGTH.LAST_NAME + ' characters.',
  },
  email: {
    required: 'Please enter your email address',
    invalid: 'Please enter a valid email address',
    maxLength:
      'Email Address must be less than ' + MAX_LENGTH.EMAIL + ' characters.',
  },
  phone: {
    required: 'Please enter your phone number',
    invalid: 'Please enter a valid phone number',
    maxLength:
      'Phone number must be less than ' + MAX_LENGTH.PHONE + ' characters.',
  },
  message: {
    required: 'Please enter your message',
    maxLength:
      'Message cannot be more than ' + MAX_LENGTH.MESSAGE + ' characters.',
  },
  street_address: {
    required: 'Please enter your Street address.',
    invalid:
      'Street Address can only contain letters, dashes, underscores and spaces.',
    maxLength:
      'Street Address must be less than ' + MAX_LENGTH.ADDRESS + ' characters.',
  },
  postal_code: {
    required: 'Please enter your postal code.',
    invalid: 'Please enter a valid postal code.',
    maxLength: 'Postal code must be less than ' + MAX_LENGTH.POSTAL_CODE,
  },
  city: {
    required: 'Please enter your city.',
    invalid: 'City can only contain letters, dashes, underscores and spaces.',
    maxLength: 'City must be less than ' + MAX_LENGTH.CITY + ' characters.',
  },
  state: {
    required: 'Please enter your state.',
    invalid: 'State can only contain letters, dashes, underscores and spaces.',
    maxLength: 'State must be less than ' + MAX_LENGTH.STATE + ' characters.',
  },
  file: {
    required: 'Please upload your file.',
    invalid:
      'File type not supported, only .png, .jpg, .pdf .doc files are allowed.',
    size: 'Please upload a file smaller than 5 MB.',
  },
  password: {
    required: 'Please enter your password',
    invalid:
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character.',
    maxLength:
      'Password must be less than ' + MAX_LENGTH.PASSWORD + ' characters.',
  },
  cart: {
    required: 'Quantity must be equal or greater than ' + MIN_LENGTH.DEFAULT,
    maxLength: `You can add upto ${MAX_LENGTH.CART_ITEMS} quantity at a time.`,
    empty: 'Your cart is empty.',
    adding: 'Adding to cart...',
    addSuccess: 'Added to cart successfully.',
  },
  captcha: {
    required: 'Please verify captcha to proceed.',
    invalid: 'Invalid captcha. Please try again.',
    expired: 'Captcha expired, please try again.',
  },
  wentWrong: 'Something went wrong. Please try again later.',
};

export const responseMessage = {
  orderNotFound: 'No order found.',
  requestCancelled: 'The request has been cancelled.',
  itemNotFound: 'Item not found.',
};
