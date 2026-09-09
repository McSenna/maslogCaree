import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import DashboardCard from "@/components/resident/DashboardCard";
import SectionHeader from "@/components/resident/SectionHeader";
import { RESIDENT_COLORS, TONES } from "@/components/resident/residentTheme";
import type { HealthTip } from "@/types/residentDashboard";

type HealthTipsProps = {
  tip: HealthTip;
  onSeeMore: () => void;
  onLearnMore: () => void;
  stacked?: boolean;
};

/**
 * The health-worker motif at the right of the Health Tips card.
 *
 * Built from primitives so it tints with the palette and bleeds into the card's
 * own background rather than sitting in a visible image box — the design has it
 * integrated into the surface, not pasted on top. Decorative only.
 */
const TipsArtwork = ({ size }: { size: number }) => (
  <View
    accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants"
    pointerEvents="none"
    className="items-center justify-end"
    style={{ width: size * 1.25, height: size }}
  >
    <View
      className="absolute rounded-full"
      style={{
        width: size * 1.15,
        height: size * 1.15,
        bottom: -size * 0.32,
        backgroundColor: "#E4EEFC",
      }}
    />
    <View
      className="absolute items-center justify-center rounded-full"
      style={{
        width: size * 0.36,
        height: size * 0.36,
        top: size * 0.06,
        left: 0,
        backgroundColor: "#FBD5DD",
      }}
    >
      <Ionicons name="heart" size={size * 0.18} color={TONES.pink.fg} />
    </View>
    <View
      className="absolute rounded-full"
      style={{
        width: size * 0.24,
        height: size * 0.44,
        right: size * 0.02,
        bottom: size * 0.1,
        backgroundColor: "#CFE8D8",
        transform: [{ rotate: "-16deg" }],
      }}
    />
    <View
      className="items-center justify-center rounded-full"
      style={{
        width: size * 0.68,
        height: size * 0.68,
        marginBottom: size * 0.04,
        backgroundColor: RESIDENT_COLORS.primary,
      }}
    >
      <Ionicons name="medkit" size={size * 0.34} color="#FFFFFF" />
    </View>
  </View>
);

const HealthTips = ({ tip, onSeeMore, onLearnMore, stacked = false }: HealthTipsProps) => (
  <DashboardCard>
    <SectionHeader title="Health Tips" actionLabel="See More" onActionPress={onSeeMore} />

    <View className={`mt-3.5 w-full ${stacked ? "gap-3" : "flex-row items-center gap-3"}`}>
      <View className="min-w-0 flex-1">
        <Text
          className={stacked ? "text-[19px] font-bold" : "text-[22px] font-bold"}
          style={{ color: RESIDENT_COLORS.heading, lineHeight: stacked ? 26 : 30 }}
        >
          {tip.headline}
        </Text>

        <Pressable
          onPress={onLearnMore}
          accessibilityRole="button"
          accessibilityLabel={tip.ctaLabel}
          className="mt-4 items-center justify-center self-start px-5 active:opacity-85"
          style={{ height: 42, borderRadius: 10, backgroundColor: RESIDENT_COLORS.primary }}
        >
          <Text className="text-[13.5px] font-semibold text-white">{tip.ctaLabel}</Text>
        </Pressable>
      </View>

      <TipsArtwork size={stacked ? 120 : 150} />
    </View>
  </DashboardCard>
);

export default HealthTips;
