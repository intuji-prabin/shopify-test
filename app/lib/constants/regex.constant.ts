export const PHONE_REGEX = /^\d{7,15}$/;
export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const NAME_REGEX = /^[-A-Za-z_@. ]{1,64}$/;
export const FULL_NAME_REGEX = /^[-A-Za-z_@. ]{1,64}$/;
export const COMPANY_NAME_REGEX = /^[a-zA-Z\d\-_\s]*$/i; //alphabet, number, dash, underscore, space
export const CITY_REGEX = /^[a-zA-Z\s]*$/;
export const STREET_ADDRESS_REGEX = /^[a-zA-Z\d\-_\s]*$/i;
export const STATE_REGEX = /^[a-zA-Z\d\-_\s]*$/i;
export const COMPANY_DOMAIN_REGEX =
  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
export const ZIP_CODE_REGEX = /^(?!0+$)\d+$/; //only number and not only 0 (zero)
export const ABN_REGEX = /^(\d *?){11}$/; //11 DIGITS NUMBER ONLY
export const PASSWORD_REGEX =
  /(^.*(?=.{6,})(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*_0-9]).*$)/; //6 characters, at least one lowercase letter, one uppercase letter, one number or one special character
export const FILE_TYPE_REGEX = /(\.pdf|\.docx|\.doc|\.png|\.jpg|\.jpeg)$/i;
export const SEARCH_FIELD_REGEX = /^[A-Za-z0-9\s]*$/i; //except special characters
export const AustralianPhoneNumberValidationRegex =
  /^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/;
