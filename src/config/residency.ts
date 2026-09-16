export const RESIDENCY = {
  barangay: process.env.EXPO_PUBLIC_RESIDENT_BARANGAY?.trim() || "Maslog",
  cityMunicipality:
    process.env.EXPO_PUBLIC_RESIDENT_CITY_MUNICIPALITY?.trim() || "Legazpi City",
  province: process.env.EXPO_PUBLIC_RESIDENT_PROVINCE?.trim() || "Albay",
} as const;
