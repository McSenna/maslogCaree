import { Badge } from "@/components/data-table";
import { useTheme } from "@/contexts/ThemeContext";
import {
  NEUTRAL_SERVICE_TONE_DARK,
  NEUTRAL_SERVICE_TONE_LIGHT,
  SERVICE_TONES_DARK,
  SERVICE_TONES_LIGHT,
} from "@/design/serviceColors";

/** A service in its own hue. Services are categories, not states, so the chip carries no icon. */
const ServiceBadge = ({ serviceKey, label, compact = false }: { serviceKey: string; label: string; compact?: boolean }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const tones = isDark ? SERVICE_TONES_DARK : SERVICE_TONES_LIGHT;
  const tone = tones[serviceKey] ?? (isDark ? NEUTRAL_SERVICE_TONE_DARK : NEUTRAL_SERVICE_TONE_LIGHT);
  return <Badge tone={{ bg: tone.bg, fg: tone.fg }} label={label} spokenAs="Service" size={compact ? "sm" : "md"} />;
};

export default ServiceBadge;
