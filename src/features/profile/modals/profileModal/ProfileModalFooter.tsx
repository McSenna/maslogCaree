import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import MaslogCareLogo from "@/components/landing/MaslogCareLogo";
import { LANDING_COLORS } from "@/config/landingAssets";

import { PROFILE_COLORS, PROFILE_RADIUS } from "../../config/profileTheme";

const FooterBrand = () => (
  <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
    <MaslogCareLogo size={32} color={LANDING_COLORS.primaryBlue} />
    <View>
      <Text style={{ fontSize: 16.5, fontWeight: "800", letterSpacing: -0.3 }}>
        <Text style={{ color: LANDING_COLORS.navy }}>Maslog</Text>
        <Text style={{ color: LANDING_COLORS.primaryBlue }}>Care</Text>
      </Text>
      <Text
        style={{
          fontSize: 9.5,
          lineHeight: 12,
          fontWeight: "600",
          color: PROFILE_COLORS.subtle,
        }}
      >
        Healthy Residents, Stronger Community
      </Text>
    </View>
  </View>
);

const FooterButton = ({
  label,
  onPress,
  tone,
  icon,
}: {
  label: string;
  onPress: () => void;
  tone: "neutral" | "danger";
  icon?: keyof typeof Feather.glyphMap;
}) => {
  const danger = tone === "danger";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="flex-row items-center justify-center active:opacity-85"
      style={{
        gap: 8,
        minHeight: 44,
        paddingHorizontal: 22,
        borderRadius: PROFILE_RADIUS.control,
        borderWidth: danger ? 0 : 1,
        borderColor: PROFILE_COLORS.border,
        backgroundColor: danger ? PROFILE_COLORS.danger : PROFILE_COLORS.surface,
      }}
    >
      {icon ? (
        <Feather name={icon} size={16} color={danger ? "#FFFFFF" : PROFILE_COLORS.body} />
      ) : null}
      <Text
        style={{
          fontSize: 14.5,
          fontWeight: danger ? "700" : "600",
          color: danger ? "#FFFFFF" : PROFILE_COLORS.body,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const ProfileModalFooter = ({
  onClose,
  onRequestLogout,
}: {
  onClose: () => void;
  onRequestLogout: () => void;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 28,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: PROFILE_COLORS.border,
        backgroundColor: PROFILE_COLORS.surface,
      }}
    >
      <View style={{ flex: 1, minWidth: 0 }}>
        <FooterBrand />
      </View>

      <FooterButton label="Close" onPress={onClose} tone="neutral" />
      <FooterButton label="Log Out" onPress={onRequestLogout} tone="danger" icon="log-out" />
    </View>
  );
};

export default ProfileModalFooter;
