import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import FieldShell from "./FieldShell";
import SelectOptionsSheet from "./selectInput/SelectOptionsSheet";
import SelectTrigger from "./selectInput/SelectTrigger";
import { useResponsive } from "@/hooks/useResponsive";

type SelectInputProps<T extends string> = {
  label: string;
  value: string;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  placeholder: string;
  icon?: keyof typeof Feather.glyphMap;
  required?: boolean;
  optional?: boolean;
  helper?: string;
  error?: string;
  height: number;
};


const SelectInput = <T extends string>({
  label,
  value,
  options,
  onChange,
  placeholder,
  icon,
  required,
  optional,
  helper,
  error,
  height,
}: SelectInputProps<T>) => {
  const [open, setOpen] = useState(false);
  const { isMobile } = useResponsive();
  const isSheet = isMobile;

  const selected = options.find((option) => option.value === value);

  return (
    <FieldShell label={label} required={required} optional={optional} helper={helper} error={error}>
      <SelectTrigger
        label={label}
        selectedLabel={selected?.label}
        placeholder={placeholder}
        icon={icon}
        open={open}
        error={error}
        height={height}
        onPress={() => setOpen(true)}
      />

      <SelectOptionsSheet
        label={label}
        value={value}
        options={options}
        open={open}
        isSheet={isSheet}
        onSelect={(next) => {
          onChange(next);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
      />
    </FieldShell>
  );
};

export default SelectInput;
