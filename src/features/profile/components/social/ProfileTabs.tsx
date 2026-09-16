import { View } from "react-native";
import { SOCIAL_COLORS } from "../../config/profileSocialTheme";
import { PROFILE_RADIUS, PROFILE_SHADOW } from "../../config/profileTheme";
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
      alignItems: "stretch",
      paddingHorizontal: 6,
      borderRadius: PROFILE_RADIUS.card,
      backgroundColor: SOCIAL_COLORS.surface,
      borderWidth: 1,
      borderColor: SOCIAL_COLORS.border,
      overflow: "hidden",
      ...PROFILE_SHADOW.card,
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
