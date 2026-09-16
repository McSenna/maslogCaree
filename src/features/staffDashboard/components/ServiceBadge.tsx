import { Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import {
  NEUTRAL_SERVICE_TONE_DARK,
  NEUTRAL_SERVICE_TONE_LIGHT,
  SERVICE_TONES_DARK,
  SERVICE_TONES_LIGHT,
} from "@/design/serviceColors";

const ServiceBadge = ({
  serviceKey,
  label,
  compact = false,
}: {
  serviceKey: string;
  label: string;
  compact?: boolean;
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const tones = isDark ? SERVICE_TONES_DARK : SERVICE_TONES_LIGHT;
  const neutral = isDark ? NEUTRAL_SERVICE_TONE_DARK : NEUTRAL_SERVICE_TONE_LIGHT;
  const tone = tones[serviceKey] ?? neutral;

  return (
    <View
      className={compact ? "rounded-full px-2 py-0.5" : "rounded-full px-2.5 py-1"}
      style={{ backgroundColor: tone.bg }}
    >
      <Text
        className={compact ? "text-[11px] font-semibold" : "text-[11.5px] font-semibold"}
        numberOfLines={1}
        style={{ color: tone.fg }}
      >
        {label}
      </Text>
    </View>
  );
};

export default ServiceBadge;
