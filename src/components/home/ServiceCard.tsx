import { Feather } from "@expo/vector-icons";
import { Text, View, useWindowDimensions } from "react-native";

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
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;

  const flexBasis = isDesktop ? "23%" : "48%";
  const flexMin = isDesktop ? "23%" : "47%";

  return (
    <View
      className="rounded-2xl p-4"
      style={{
        flexBasis,
        flexGrow: 0,
        flexShrink: 0,
        minWidth: flexMin,
        maxWidth: isDesktop ? "24%" : "48%",
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: border,
        shadowColor: shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
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
  );
}
