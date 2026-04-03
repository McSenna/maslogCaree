import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { BREAKPOINTS } from "@/constants/breakpoints";

export type ServiceCardItem = {
  icon: string;
  label: string;
  desc: string;
  color: string;
  bg: string;
  iconBg: string;
  border: string;
  shadow: string;
};

type ServiceCardProps = ServiceCardItem;

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "").trim();
  if (normalized.length !== 6) return `rgba(0,0,0,${alpha})`;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function ServiceCard({
  icon,
  label,
  desc,
  color,
  bg,
  iconBg,
  border,
  shadow,
}: ServiceCardProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= BREAKPOINTS.tablet;
  const isDesktop = width >= BREAKPOINTS.desktop;

  const flexBasis = isDesktop ? "23%" : "48%";
  const flexMin = isDesktop ? "23%" : "47%";

  return (
    <Pressable
      style={({ pressed }) => ({
        flexBasis,
        flexGrow: 0,
        flexShrink: 0,
        minWidth: flexMin,
        maxWidth: isDesktop ? "24%" : "48%",
        opacity: pressed ? 0.92 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <View
        className="rounded-2xl p-4"
        style={{
          backgroundColor: bg,
          borderWidth: 1,
          borderColor: border,
          boxShadow: `0px 2px 8px ${hexToRgba(shadow, 0.06)}`,
          elevation: 3,
        }}
      >
        <View
          className="mb-3 self-start rounded-xl p-2.5"
          style={{ backgroundColor: iconBg }}
        >
          <Feather name={icon as any} size={isTablet ? 22 : 18} color={color} />
        </View>

        <Text
          className="mb-1 font-bold leading-tight text-slate-800"
          style={{ fontSize: isTablet ? 14 : 13 }}
          numberOfLines={1}
        >
          {label}
        </Text>

        <Text
          className="leading-relaxed"
          style={{
            fontSize: isTablet ? 12 : 11,
            color: "#6B7280",
            lineHeight: isTablet ? 17 : 15,
          }}
          numberOfLines={2}
        >
          {desc}
        </Text>
      </View>
    </Pressable>
  );
}
