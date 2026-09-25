import { Platform, Text, View } from "react-native";
import { useResponsive } from "@/hooks/useResponsive";
import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import EclipseLoader from "./EclipseLoader";

const SIZE = { mobile: 40, desktop: 48 } as const;

const PageLoader = ({
  label = "Loading…",
  showLabel = true,
}: {
  label?: string;
  showLabel?: boolean;
}) => {
  const { width, isMobile } = useResponsive();
  const palette = useQueuePalette();
  const size = width > 0 && isMobile ? SIZE.mobile : SIZE.desktop;

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ gap: 14, padding: 24 }}
      accessibilityLiveRegion="polite"
      {...(Platform.OS === "web" ? ({ "aria-live": "polite" } as object) : {})}
    >
      <EclipseLoader size={size} color={palette.primary} accessibilityLabel={label} />

      {showLabel ? (
        <Text className="text-[12.5px] font-medium" style={{ color: palette.muted }}>
          {label}
        </Text>
      ) : null}
    </View>
  );
};

export default PageLoader;
