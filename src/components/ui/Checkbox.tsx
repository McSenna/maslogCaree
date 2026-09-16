import { Feather } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

type CheckboxProps = {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (next: boolean) => void;
  accessibilityLabel: string;
};

const Checkbox = ({
  checked,
  indeterminate = false,
  onChange,
  accessibilityLabel,
}: CheckboxProps) => {
  const palette = useAdminSurfacePalette();
  const filled = checked || indeterminate;

  return (
    <Pressable
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: indeterminate ? "mixed" : checked }}
      hitSlop={13}
      className="h-[18px] w-[18px] items-center justify-center border"
      style={{
        borderRadius: 5,
        backgroundColor: filled ? palette.primary : palette.cardBg,
        borderColor: filled ? palette.primary : palette.controlBorder,
      }}
    >
      {indeterminate ? (
        <View className="h-0.5 w-2.5 rounded-full bg-white" />
      ) : checked ? (
        <Feather name="check" size={12} color="#FFFFFF" />
      ) : null}
    </Pressable>
  );
};

export default Checkbox;
