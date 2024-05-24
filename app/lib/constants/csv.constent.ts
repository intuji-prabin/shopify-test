/**
 * @file csv.constant.ts
 */

const LIMIT = 200;

const ROWS = Object.freeze({
  STOCKCODE: 'stockCode',
  UOM: 'uom',
  QUANTITY: 'quantity',
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_FILE_TYPE = {
  'text/csv': [],
  'application/vnd.ms-excel': [],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
};

export const CSV = {
  LIMIT,
  ROWS,
  MAX_FILE_SIZE,
  ACCEPTED_FILE_TYPE,
};
