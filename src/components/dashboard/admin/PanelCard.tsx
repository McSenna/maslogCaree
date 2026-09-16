import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";

type PanelCardProps = {
  palette: AdminDashboardPalette;
  title: string;
  icon?: keyof typeof Feather.glyphMap;
  subtitle?: string;
  onViewAll?: () => void;
  viewAllLabel?: string;
  headerRight?: ReactNode;
  children: ReactNode;
  fill?: boolean;
  centerContent?: boolean;
};

const PanelCard = ({
  palette,
  title,
  icon,
  subtitle,
  onViewAll,
  viewAllLabel = "View All",
  headerRight,
  children,
  fill = false,
  centerContent = false,
}: PanelCardProps) => {
  return (
    <View
      className="rounded-2xl border p-4"
      style={{
        flex: fill ? 1 : undefined,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
      }}
    >
      <View className="mb-3 flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1 flex-row items-center gap-2.5">
          {icon ? (
            <View
              className="h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: palette.tones.blue.iconBg }}
            >
              <Feather name={icon} size={17} color={palette.tones.blue.icon} />
            </View>
          ) : null}
          <View className="min-w-0 flex-1">
            <Text
              className="min-w-0 text-[15px] font-bold"
              numberOfLines={1}
              style={{ color: palette.heading }}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text
                className="mt-0.5 text-[12px] font-medium"
                numberOfLines={1}
                style={{ color: palette.muted }}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        <View className="shrink-0 flex-row items-center gap-2.5">
          {headerRight}
          {onViewAll ? (
            <Pressable
              onPress={onViewAll}
              accessibilityRole="link"
              accessibilityLabel={`${viewAllLabel} — ${title}`}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 8 }}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Text className="text-[12.5px] font-semibold" style={{ color: palette.primary }}>
                {viewAllLabel}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
      <View
        style={{
          flex: fill && centerContent ? 1 : undefined,
          justifyContent: centerContent ? "center" : undefined,
        }}
      >
        {children}
      </View>
    </View>
  );
};

export default PanelCard;
