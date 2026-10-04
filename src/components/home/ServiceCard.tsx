import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, SlideInUp } from "react-native-reanimated";
import { useResponsive } from "@/hooks/useResponsive";
import { PALETTE, withAlpha } from "@/theme/palette";

export type ServiceCardItem = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  desc: string;
  color: string;
  bg: string;
  iconBg: string;
  border: string;
  shadow: string;
};

type ServiceCardProps = ServiceCardItem;

const ServiceCard = ({
  icon,
  label,
  desc,
  color,
  bg,
  iconBg,
  border,
  shadow,
}: ServiceCardProps) => {
  const { isMobile, isDesktop } = useResponsive();
  const isTablet = !isMobile;

  const flexBasis = isDesktop ? "23%" : "48%";
  const flexMin = isDesktop ? "23%" : "47%";

  return (
    <Animated.View
      entering={FadeIn.duration(400).delay(100)}
      style={{ flexBasis, flexGrow: 0, flexShrink: 0, minWidth: flexMin, maxWidth: isDesktop ? "24%" : "48%" }}
    >
      <Pressable
        style={({ pressed }) => ({
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        <Animated.View
          className="rounded-lg p-4"
          entering={SlideInUp.duration(500).delay(150)}
          style={{
            backgroundColor: bg,
            borderWidth: 1,
            borderColor: border,
            boxShadow: `0px 2px 8px ${withAlpha(shadow, 0.06)}`,
            elevation: 3,
          }}
        >
          <View
            className="mb-3 self-start rounded-xl p-2.5"
            style={{ backgroundColor: iconBg }}
          >
          <Feather name={icon} size={isTablet ? 22 : 18} color={color} />
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
            color: PALETTE.slate[500],
            lineHeight: isTablet ? 17 : 15,
          }}
          numberOfLines={2}
        >
          {desc}
        </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export default ServiceCard;
