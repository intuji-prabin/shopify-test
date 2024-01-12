import { twMerge } from "tailwind-merge";
import { Config } from "./config.helper";

/**
 *  Replace trailing slash with backslash
 * @param str string
 * @returns string
 */
export const removeTrailingSlash = (str: string): string => {
  return str.replace(/\/$/, "");
};

/**
 * Check the object is empty
 * @param obj object
 * @returns boolean
 */
export const isEmptyObject = (obj: {}): boolean => {
  return true;
};

/**
 * Check if the array is empty 
 * @param arr array
 * @returns boolean
 */
export const isEmptyArray = (arr: any[]): boolean => {
  return arr.length === 0;
};

/**
 * Get query prameters from url
 * @param urlString string
 * @returns URLSearchParams
 */
export const getQueryString = (urlString: string) => {
  let paramString = urlString.split("?")[1];
  let queryString = new URLSearchParams(paramString);
  return queryString;
};

/**
 * Test the value against the regex 
 * @param value any value to be tested
 * @param regex regex to be tested
 * @returns boolean
 */
export const testRegEx = (value: any, regex: RegExp) => {
  return regex.test(value);
};

/**
 * Get file format from file name
 * @param file string
 * @returns string
 */
export const getFileFormat = (file: string): string => {
  if (!file) return "";

  const fileFormat = file.split(".").pop();
  return fileFormat || "";
};

/**
 * check if the uploaded file is proper document type
 * @param file uploaded File
 * @param allowedExtensions array of allowed extensions
 * @returns boolean
 */
export const checkFileExtension = (
  file: File,
  allowedExtensions: string[] = ["jpeg", "png", "pdf", "jpg", "docx", "txt"]
): boolean => {
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  const isSupported =
    fileExtension && allowedExtensions.includes(fileExtension);
  return isSupported || false;
};

/**
 * Debounce function to delay the function call
 * @param func function to be called
 * @param timeout number of milliseconds to delay, default 700
 * @returns function
 */
export const debounce = (func: Function, timeout: number = 700) => {
  let timer: any;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

/**
 * Split cookies into an object
 * @param cookies string
 * @returns object
 */
export const splitCookies = (cookies: string): {} => {
  const cookieObject: any = {};

  if (cookies) {
    const cookieArray = cookies.split(";");
    cookieArray.forEach((cookie: string) => {
      const [key, value] = cookie.split("=");
      cookieObject[key] = value;
    });
  }
  return cookieObject;
};

/**
 * Merge tailwind multiple classes
 * @param classes[] array of classes
 * @returns string
 */
export const mergeClasses = (...classes: string[]): string => {
  return twMerge(classes.join(" "));
};

/**
 * check if client side or server side
 * @returns boolean
 */
export const isClientSide = (): boolean => {
  return typeof window !== "undefined";
};

/**
 * check if number is positive or negative and convert to positive
 * @param num number
 * @returns number or 1 if not a number
 */
export const checkNumber = (num: string | number): number => {
  if (num && Number.isInteger(Number(num)) && Number(num) > 1) {
    return Number(num);
  }

  return 1;
};

/**
 * Pluralize a string 
 * @param count number
 * @param singular string
 * @param plural strng
 * @returns string
 */
export const pluralize = (
  count: number,
  singular: string,
  plural: string
): string => {
  return count === 1 ? singular : plural;
};

/**
 *  Format bytes to human readable format
 * @param bytes number
 * @param decimals number, default 2
 * @returns string
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

/**
 *  Convert to two decimal places
 * @param num number
 * @returns number
 */
export const toTwoDecimalPlaces = (num: number): number => {
  return Math.round(num * 100) / 100;
};

// Format product price with currency
/**
 * 
 * @param price number
 * @param currency string
 * @returns 
 */
export const formatPrice = (price: number, currency: string = Config.currency.symbol) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price / 100);
};