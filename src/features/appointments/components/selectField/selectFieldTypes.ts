import type { MaterialCommunityIcons } from "@expo/vector-icons";

export type SelectOption = {
  id: string;
  label: string;
  helper?: string;
};

export type FormSelectFieldProps = {
  label: string;
  required?: boolean;
  placeholder: string;
  sheetTitle?: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  options: SelectOption[];
  value: string | null;
  onChange: (id: string) => void;
  error?: string | null;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
  helperText?: string | null;
};
