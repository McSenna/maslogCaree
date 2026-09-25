import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";

type Tone = { bg: string; border: string; chip: string; icon: string; label: string };

const AMBER: Record<"light" | "dark", Tone> = {
  light: { bg: "#FFF8EC", border: "#FBE8C6", chip: "#FDECC8", icon: "#D97706", label: "#92640C" },
  dark: {
    bg: "rgba(217,119,6,0.14)",
    border: "rgba(217,119,6,0.32)",
    chip: "rgba(217,119,6,0.24)",
    icon: "#F59E0B",
    label: "#FBBF24",
  },
};

const toneFor = (tone: "amber" | "blue", palette: AdminDashboardPalette, isDark: boolean): Tone => {
  if (tone === "amber") return isDark ? AMBER.dark : AMBER.light;
  const blue = palette.tones.blue;
  return { bg: blue.cardBg, border: blue.cardBorder, chip: blue.iconBg, icon: blue.icon, label: blue.label };
};

/** A compact callout tile for the one data point worth noticing (busiest day, latest month…). */
const HighlightStat = ({
  palette,
  tone,
  icon,
  label,
  value,
  meta,
}: {
  palette: AdminDashboardPalette;
  tone: "amber" | "blue";
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  meta?: string;
}) => {
  const { resolvedTheme } = useTheme();
  const colors = toneFor(tone, palette, resolvedTheme === "dark");

  return (
    <View
      accessible
      accessibilityLabel={[label, value, meta].filter(Boolean).join(", ")}
      className="flex-row items-center gap-2.5 self-start rounded-xl border py-2 pl-2.5 pr-3.5"
      style={{ backgroundColor: colors.bg, borderColor: colors.border, maxWidth: "100%" }}
    >
      <View
        className="h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: colors.chip }}
      >
        <MaterialCommunityIcons name={icon} size={18} color={colors.icon} />
      </View>
      <View className="min-w-0 shrink">
        <Text
          numberOfLines={1}
          className="text-[10.5px] font-bold uppercase"
          style={{ color: colors.label, letterSpacing: 0.6 }}
        >
          {label}
        </Text>
        <Text numberOfLines={1} className="text-[14px] font-bold" style={{ color: palette.heading }}>
          {value}
        </Text>
        {meta ? (
          <Text numberOfLines={1} className="text-[11.5px] font-medium" style={{ color: palette.muted }}>
            {meta}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default HighlightStat;
