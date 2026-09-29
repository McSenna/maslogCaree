import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { DASHBOARD_CARD_SHADOW, type AdminDashboardPalette } from "@/design/adminDashboardTheme";
import DashboardButton from "./DashboardButton";

const TITLE_MIN_WIDTH = 240;

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
  viewAllLabel = "View all",
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
        ...DASHBOARD_CARD_SHADOW,
      }}
    >
      <View
        className={`mb-3 flex-row items-start justify-between ${headerRight ? "flex-wrap" : ""}`}
        style={{ columnGap: 12, rowGap: 10 }}
      >
        <View
          className="flex-row items-center gap-2.5"
          style={{ flexGrow: 1, flexShrink: 1, flexBasis: headerRight ? TITLE_MIN_WIDTH : 0, minWidth: 0 }}
        >
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
              accessibilityRole="header"
              aria-level={2}
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
            <DashboardButton
              palette={palette}
              variant="link"
              label={viewAllLabel}
              trailingIcon="arrow-right"
              onPress={onViewAll}
              accessibilityLabel={`${viewAllLabel}: ${title}`}
            />
          ) : null}
        </View>
      </View>
      <View
        style={{
          flex: fill ? 1 : undefined,
          justifyContent: centerContent ? "center" : undefined,
        }}
      >
        {children}
      </View>
    </View>
  );
};

export default PanelCard;
