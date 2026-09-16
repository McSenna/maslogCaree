import { MONTHS } from "../constants/registrationFields";

export const formatBirthDate = (raw: string): string => {
  if (!raw) return "";
  const [year, month, day] = raw.split("-");
  if (!year || !month || !day) return raw;
  return `${MONTHS[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
};

export const daysInMonth = (year: number, monthIndex: number): number => {
  return new Date(year, monthIndex + 1, 0).getDate();
};

export const toIsoBirthDate = (year: number, monthIndex: number, day: number): string => {
  const paddedMonth = String(monthIndex + 1).padStart(2, "0");
  const paddedDay = String(day).padStart(2, "0");
  return `${year}-${paddedMonth}-${paddedDay}`;
};
