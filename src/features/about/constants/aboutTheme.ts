/**
 * The About page's own palette.
 *
 * A public, outward-facing page rather than an admin surface, so it uses the
 * barangay's health-service teal rather than the dashboard's blues.
 */
export const HC = {
  teal: "#0B7A75",
  tealLight: "#14A89F",
  tealPale: "#E6F7F6",
  tealMid: "#B2E5E3",
  emerald: "#059669",
  emeraldPale: "#ECFDF5",
  navy: "#0F2D3D",
  navyMid: "#1A4259",
  sky: "#0EA5E9",
  skyPale: "#E0F2FE",
  gold: "#D4A017",
  goldPale: "#FEF9EC",
  white: "#FFFFFF",
  offWhite: "#F4F9F9",
  slate: "#64748B",
  slateLight: "#94A3B8",
  border: "#D1EAE9",
  shadow: "#0B7A75",
};

/** One tone per health worker card, cycled so adjacent cards differ. */
export const BHW_PALETTE = [
  { fg: "#0B7A75", bg: "#B2E5E3", light: "#E6F7F6" },
  { fg: "#059669", bg: "#A7F3D0", light: "#ECFDF5" },
  { fg: "#0369A1", bg: "#BAE6FD", light: "#E0F2FE" },
  { fg: "#7C3AED", bg: "#DDD6FE", light: "#F5F3FF" },
  { fg: "#B45309", bg: "#FDE68A", light: "#FFFBEB" },
  { fg: "#0E7490", bg: "#A5F3FC", light: "#ECFEFF" },
  { fg: "#4338CA", bg: "#C7D2FE", light: "#EEF2FF" },
  { fg: "#BE123C", bg: "#FECDD3", light: "#FFF1F2" },
  { fg: "#4D7C0F", bg: "#D9F99D", light: "#F7FEE7" },
  { fg: "#0F766E", bg: "#99F6E4", light: "#F0FDFA" },
];

/** How many health worker cards sit on one row of the grid. */
export const BHW_COLUMNS = 3;
