import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { useUserDetailsPalette } from "./detailsTheme";

/**
 * One titled block of the phone sheet.
 *
 * A heading over a hairline rather than a bordered card per section: the sheet
 * is already a raised surface, and nesting cards inside it would spend the
 * phone's narrow width on borders that say nothing. `quiet` drops the section
 * a step in emphasis, for the account metadata that is reference rather than
 * the reason the admin opened the sheet.
 */
export default function SheetSection({
  title,
  children,
  quiet = false,
}: {
  title: string;
  children: ReactNode;
  quiet?: boolean;
}) {
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
}
