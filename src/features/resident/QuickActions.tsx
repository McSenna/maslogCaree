import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import DashboardCard from "@/components/resident/DashboardCard";
import SectionHeader from "@/components/resident/SectionHeader";
import { CARD, RESIDENT_COLORS, TONES } from "@/components/resident/residentTheme";
import type { QuickAction } from "@/types/residentDashboard";

type QuickActionsProps = {
  actions: QuickAction[];
  onActionPress: (action: QuickAction) => void;
  onViewAll: () => void;
  /** Phone layout: a 2x2 grid with the shorter labels. */
  stacked?: boolean;
};

const QuickActionTile = ({
  action,
  onPress,
  stacked,
}: {
  action: QuickAction;
  onPress: () => void;
  stacked: boolean;
}) => {
  const tone = TONES[action.tone];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={action.label}
      android_ripple={{ color: `${tone.fg}18` }}
      className="min-w-0 flex-1 items-center justify-center gap-2 px-2 py-4 active:opacity-80"
      style={{
        // Above the 44px touch-target minimum at every size.
        minHeight: stacked ? 96 : 104,
        borderRadius: CARD.radiusSm,
        backgroundColor: tone.bg,
      }}
    >
      <Ionicons name={action.icon} size={stacked ? 22 : 24} color={tone.fg} />
      <Text
        className="text-center text-[12px] font-semibold"
        numberOfLines={2}
        style={{ color: RESIDENT_COLORS.heading }}
      >
        {stacked ? action.shortLabel : action.label}
      </Text>
    </Pressable>
  );
};

/**
 * The four shortcuts, each on its own pastel tile.
 *
 * One row on desktop as the design shows; a 2x2 grid on a phone, where four
 * across would leave roughly 70px a tile and wrap every label to three lines.
 */
const QuickActions = ({ actions, onActionPress, onViewAll, stacked = false }: QuickActionsProps) => (
  <DashboardCard>
    <SectionHeader title="Quick Actions" actionLabel="View All" onActionPress={onViewAll} />

    {stacked ? (
      <View className="mt-3.5 w-full gap-2.5">
        <View className="w-full flex-row gap-2.5">
          {actions.slice(0, 2).map((action) => (
            <QuickActionTile
              key={action.id}
              action={action}
              stacked
              onPress={() => onActionPress(action)}
            />
          ))}
        </View>
        <View className="w-full flex-row gap-2.5">
          {actions.slice(2).map((action) => (
            <QuickActionTile
              key={action.id}
              action={action}
              stacked
              onPress={() => onActionPress(action)}
            />
          ))}
        </View>
      </View>
    ) : (
      <View className="mt-3.5 w-full flex-row gap-2.5">
        {actions.map((action) => (
          <QuickActionTile
            key={action.id}
            action={action}
            stacked={false}
            onPress={() => onActionPress(action)}
          />
        ))}
      </View>
    )}
  </DashboardCard>
);

export default QuickActions;
