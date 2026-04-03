import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { UI } from "@/design/tokens";

type ChipProps = {
  label: string;
  leftIcon?: ReactNode;
  className?: string;
};

export default function Chip({ label, leftIcon, className = "" }: ChipProps) {
  return (
    <View className={[UI.chipClassName, "flex-row items-center gap-1.5", className].join(" ")}>
      {leftIcon ? <View>{leftIcon}</View> : null}
      <Text className={UI.chipTextClassName}>{label}</Text>
    </View>
  );
}

