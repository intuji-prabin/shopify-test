//8 characters, at least one lowercase letter, one uppercase letter, one number or one special character
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const AUSTRALIAN_PHONENUMBER_VALIDATION_REGEX =
  /^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/;

export const NumberPlusOnly = /^\+?[\d\s]*$/;
