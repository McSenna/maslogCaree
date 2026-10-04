import { Feather } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { spaceKeyActivates } from "@/utils/spaceKeyActivates";

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
      {...spaceKeyActivates(() => onChange(!checked))}
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: indeterminate ? "mixed" : checked }}
      // react-native-web drops accessibilityState.checked, so the web attribute is set directly.
      aria-checked={indeterminate ? "mixed" : checked}
      hitSlop={13}
      className="h-[18px] w-[18px] items-center justify-center border"
      style={{
        borderRadius: 5,
        backgroundColor: filled ? palette.primary : palette.cardBg,
        borderColor: filled ? palette.primary : palette.controlBorder,
      }}
    >
      {indeterminate ? (
        <View className="h-0.5 w-2.5 rounded-full" style={{ backgroundColor: palette.onPrimary }} />
      ) : checked ? (
        <Feather name="check" size={12} color={palette.onPrimary} />
      ) : null}
    </Pressable>
  );
};

export default Checkbox;
