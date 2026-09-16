import { Feather } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { CARD_SHADOW, RADIUS, useUsersPalette } from "./usersTheme";

export const USER_SECTIONS = ["active", "requests", "rejected", "deactivated"] as const;
export type UserSection = (typeof USER_SECTIONS)[number];

type SectionSpec = {
  key: UserSection;
  label: string;
  shortLabel: string;
  icon: keyof typeof Feather.glyphMap;
};

const SECTIONS: readonly SectionSpec[] = [
  { key: "active", label: "Active Users", shortLabel: "Active", icon: "users" },
  { key: "requests", label: "User Requests", shortLabel: "Requests", icon: "user-check" },
  { key: "rejected", label: "Rejected Requests", shortLabel: "Rejected", icon: "user-x" },
  { key: "deactivated", label: "Deactivated Users", shortLabel: "Deactivated", icon: "user-minus" },
];

type UserSectionTabsProps = {
  section: UserSection;
  onSectionChange: (section: UserSection) => void;
  counts: Record<UserSection, number>;
  isDesktop: boolean;
};

const Tab = ({
  spec,
  selected,
  count,
  isDesktop,
  onPress,
}: {
  spec: SectionSpec;
  selected: boolean;
  count: number;
  isDesktop: boolean;
  onPress: () => void;
}) => {
  const palette = useUsersPalette();

  const isCallout = spec.key === "requests" && count > 0;
  const badgeBg = selected ? "rgba(255,255,255,0.22)" : isCallout ? palette.primary : palette.skeleton;
  const badgeText = selected || isCallout ? "#FFFFFF" : palette.muted;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={`${spec.label}${count > 0 ? `, ${count}` : ""}`}
      className="flex-row items-center justify-center gap-2 px-3.5 active:opacity-85"
      style={{
        height: 42,
        borderRadius: RADIUS.control,
        backgroundColor: selected ? palette.primary : "transparent",
        flex: isDesktop ? 1 : undefined,
      }}
    >
      <Feather
        name={spec.icon}
        size={15}
        color={selected ? "#FFFFFF" : palette.muted}
      />
      <Text
        className="text-[13.5px] font-semibold"
        numberOfLines={1}
        style={{ color: selected ? "#FFFFFF" : palette.heading }}
      >
        {isDesktop ? spec.label : spec.shortLabel}
      </Text>

      {count > 0 ? (
        <View
          className="items-center justify-center px-1.5"
          style={{ minWidth: 22, height: 20, borderRadius: RADIUS.pill, backgroundColor: badgeBg }}
        >
          <Text className="text-[11px] font-bold" style={{ color: badgeText }}>
            {count > 99 ? "99+" : count}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
};

const UserSectionTabs = ({
  section,
  onSectionChange,
  counts,
  isDesktop,
}: UserSectionTabsProps) => {
  const palette = useUsersPalette();

  const tabs = SECTIONS.map((spec) => (
    <Tab
      key={spec.key}
      spec={spec}
      selected={section === spec.key}
      count={counts[spec.key] ?? 0}
      isDesktop={isDesktop}
      onPress={() => onSectionChange(spec.key)}
    />
  ));

  const shell = {
    borderRadius: RADIUS.card,
    backgroundColor: palette.cardBg,
    borderColor: palette.cardBorder,
    ...CARD_SHADOW,
  };

  if (isDesktop) {
    return (
      <View accessibilityRole="tablist" className="w-full flex-row gap-1.5 border p-1.5" style={shell}>
        {tabs}
      </View>
    );
  }

  return (
    <View className="w-full border" style={shell}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 6, gap: 6 }}
      >
        <View accessibilityRole="tablist" className="flex-row gap-1.5">
          {tabs}
        </View>
      </ScrollView>
    </View>
  );
};

export default UserSectionTabs;
