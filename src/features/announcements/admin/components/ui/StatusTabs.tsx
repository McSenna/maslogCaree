import { Pressable, ScrollView, Text, View, type TextStyle } from "react-native";

import type { StatusCounts, StatusFilter } from "../../adminAnnouncement.types";

const TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Drafts" },
  { value: "expired", label: "Expired" },
];

// NativeWind has no class for fontVariant on native.
const TABULAR: TextStyle = { fontVariant: ["tabular-nums"] };

type StatusTabsProps = {
  value: StatusFilter;
  counts: StatusCounts;
  onChange: (value: StatusFilter) => void;
  /** Wide layout: 14px labels, 24px apart, no scrolling. */
  wide?: boolean;
};

const Tab = ({ label, count, selected, wide, onPress }: {
  label: string;
  count: number;
  selected: boolean;
  wide?: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="tab"
    accessibilityLabel={`${label}, ${count}`}
    accessibilityState={{ selected }}
    className={`${wide ? "-mb-px" : ""} min-h-11 flex-row items-center gap-1.5 border-b-2 px-0.5 web:cursor-pointer ${selected ? "border-brand" : "border-transparent"}`}
  >
    <Text
      className={`${wide ? "text-14" : "text-15"} ${selected ? "font-ps-semibold text-ink" : "font-ps-medium text-text2"}`}
    >
      {label}
    </Text>
    <View className={`min-h-5 min-w-5 items-center justify-center rounded-badge px-1.5 ${selected ? "bg-brand-tint" : "bg-neutral"}`}>
      <Text style={TABULAR} className={`font-ps-semibold text-12 ${selected ? "text-brand" : "text-text3"}`}>
        {count}
      </Text>
    </View>
  </Pressable>
);

const StatusTabs = ({ value, counts, onChange, wide }: StatusTabsProps) => {
  const tabs = TABS.map((tab) => (
    <Tab
      key={tab.value}
      label={tab.label}
      count={counts[tab.value]}
      selected={value === tab.value}
      wide={wide}
      onPress={() => onChange(tab.value)}
    />
  ));

  if (wide) {
    return (
      <View accessibilityRole="tablist" className="flex-row gap-6">
        {tabs}
      </View>
    );
  }

  return (
    <View className="mt-3 border-b border-line">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        accessibilityRole="tablist"
        contentContainerClassName="gap-5 px-4"
      >
        {tabs}
      </ScrollView>
    </View>
  );
};

export default StatusTabs;
