import { Platform, Text, View, useWindowDimensions } from "react-native";
import { BREAKPOINTS } from "@/constants/breakpoints";
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
  const { width } = useWindowDimensions();
  const palette = useQueuePalette();
  const size = width > 0 && width < BREAKPOINTS.tablet ? SIZE.mobile : SIZE.desktop;

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
