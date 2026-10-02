import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Text, View } from "react-native";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";

type EmptyPanelStateProps = {
  palette: AdminDashboardPalette;
  icon: keyof typeof Feather.glyphMap;
  message: string;
  /** Page-level empty states name what is missing above the message. */
  title?: string;
  /** The next step, e.g. a "Clear filters" button. */
  children?: ReactNode;
};

const EmptyPanelState = ({ palette, icon, message, title, children }: EmptyPanelStateProps) => {
  return (
    <View className="items-center gap-2 px-4 py-8">
      <View
        className="h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: palette.divider }}
      >
        <Feather name={icon} size={20} color={palette.subtle} />
      </View>
      {title ? (
        <Text accessibilityRole="header" className="text-center text-[15px] font-semibold" style={{ color: palette.heading }}>
          {title}
        </Text>
      ) : null}
      <Text className="max-w-[360px] text-center text-[13px] font-medium" style={{ color: palette.muted }}>
        {message}
      </Text>
      {children ? <View className="mt-2">{children}</View> : null}
    </View>
  );
};

export default EmptyPanelState;
