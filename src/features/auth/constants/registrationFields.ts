export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const CURRENT_YEAR = new Date().getFullYear();

export const BIRTH_YEARS = Array.from({ length: 100 }, (_, index) => CURRENT_YEAR - index);

export const DAYS_OF_MONTH = Array.from({ length: 31 }, (_, index) => index + 1);

export const DEFAULT_BIRTH_YEAR = CURRENT_YEAR - 25;
