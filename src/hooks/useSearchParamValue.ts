import { useLocalSearchParams } from "expo-router";

/**
 * One query-string value as a plain string ("" when absent). Dashboard shortcuts use these to open a
 * screen on a specific tab or dialog, e.g. `/admin/users?section=requests`.
 */
export const useSearchParamValue = (name: string): string => {
  const params = useLocalSearchParams<Record<string, string | string[]>>();
  const value = params[name];
  return (Array.isArray(value) ? value[0] : value) ?? "";
};
