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

/** A century back — enough for any resident, without an unbounded wheel. */
export const BIRTH_YEARS = Array.from({ length: 100 }, (_, index) => CURRENT_YEAR - index);

export const DAYS_OF_MONTH = Array.from({ length: 31 }, (_, index) => index + 1);

/** The year the date wheel opens on when no birthday has been chosen. */
export const DEFAULT_BIRTH_YEAR = CURRENT_YEAR - 25;

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const;

/**
 * Where to scroll when a field takes focus.
 *
 * Fixed offsets rather than measured positions: the form's height is constant,
 * and measuring each field would add a layout pass per render to solve a
 * problem the layout does not actually have.
 */
export const FIELD_SCROLL_OFFSETS: Record<string, number> = {
  fullname: 150,
  email: 250,
  password: 350,
  address: 750,
};

/** Field colours, shared by every input so focus and error read identically. */
export const FIELD_COLORS = {
  border: "#E2E8F0",
  borderFocused: "#3B5BDB",
  borderError: "#EF4444",
  background: "#fff",
  backgroundFocused: "#EEF2FF",
  icon: "#94A3B8",
  iconFocused: "#3B5BDB",
  placeholder: "#CBD5E1",
  text: "#1E293B",
} as const;
