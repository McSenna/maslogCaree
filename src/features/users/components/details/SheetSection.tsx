import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { useUserDetailsPalette } from "./detailsTheme";

const SheetSection = ({
  title,
  children,
  quiet = false,
}: {
  title: string;
  children: ReactNode;
  quiet?: boolean;
}) => {
  const palette = useUserDetailsPalette();

  return (
    <View className="w-full px-4">
      <Text
        accessibilityRole="header"
        className={`${quiet ? "text-[12px]" : "text-[13px]"} font-bold uppercase`}
        style={{ color: quiet ? palette.subtle : palette.muted, letterSpacing: 0.7 }}
      >
        {title}
      </Text>
      <View className="mt-1">{children}</View>
    </View>
  );
};

export default SheetSection;
