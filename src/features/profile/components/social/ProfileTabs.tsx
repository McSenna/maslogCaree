import { View } from "react-native";
import { SPACING } from "@/theme/spacing";
import type { ProfileTabDefinition } from "../../config/profileTabs";
import type { ProfileTabKey } from "../../types/profile.types";
import ProfileTabButton from "./ProfileTabButton";

type ProfileTabsProps = {
  tabs: ProfileTabDefinition[];
  activeTab: ProfileTabKey;
  onSelect: (key: ProfileTabKey) => void;
  compact: boolean;
};

const ProfileTabs = ({ tabs, activeTab, onSelect, compact }: ProfileTabsProps) => (
  <View
    accessibilityRole="tablist"
    style={{
      flexDirection: "row",
      gap: compact ? 0 : SPACING.xs,
      paddingHorizontal: compact ? SPACING.sm : SPACING.lg,
    }}
  >
    {tabs.map((tab) => (
      <ProfileTabButton
        key={tab.key}
        tab={tab}
        active={tab.key === activeTab}
        compact={compact}
        onPress={() => onSelect(tab.key)}
      />
    ))}
  </View>
);

export default ProfileTabs;
