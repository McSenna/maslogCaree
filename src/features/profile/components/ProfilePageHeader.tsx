import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import IconButton from "@/components/buttons/IconButton";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import { PROFILE_SUBTITLE } from "../config/profileRoleConfig";

const CLOSE_SIZE = 44;
const TITLE_MIN_WIDTH = 240;

type ProfilePageHeaderProps = {
  title: string;
  onClose?: () => void;
};

const ProfilePageHeader = ({ title, onClose }: ProfilePageHeaderProps) => {
  const colors = useThemeColors();

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: SPACING.lg,
        paddingHorizontal: SPACING.xxl,
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
      }}
    >
      <View style={{ flex: 1, flexBasis: TITLE_MIN_WIDTH, minWidth: 0 }}>
        <View accessibilityLabel="Breadcrumb: Profile" style={{ flexDirection: "row", alignItems: "center", gap: SPACING.xs }}>
          <Feather name="chevron-right" size={14} color={colors.muted} />
          <Text style={{ ...TYPE.caption, fontWeight: "400", color: colors.muted }}>Profile</Text>
        </View>
        <Text
          accessibilityRole="header"
          aria-level={1}
          style={{ ...TYPE.display, letterSpacing: -0.5, color: colors.heading }}
        >
          {title}
        </Text>
        <Text style={{ ...TYPE.body, color: colors.muted }}>{PROFILE_SUBTITLE}</Text>
      </View>

      {onClose ? (
        <IconButton
          icon="x"
          label="Close profile"
          onPress={onClose}
          size={CLOSE_SIZE}
          showTooltip={false}
          initialFocus
          style={{ borderRadius: RADII.medium, backgroundColor: colors.surfaceMuted }}
        />
      ) : null}
    </View>
  );
};

export default ProfilePageHeader;
