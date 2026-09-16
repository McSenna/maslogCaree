import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { SOCIAL_COLORS } from "../../config/profileSocialTheme";
import { PROFILE_RADIUS } from "../../config/profileTheme";
import type { ProfileIconName } from "../../types/profile.types";

type ProfileEmptyStateProps = {
  icon: ProfileIconName;
  title: string;
  body: string;
  tone?: "neutral" | "error";
  action?: { label: string; onPress: () => void };
};

const ProfileEmptyState = ({
  icon,
  title,
  body,
  tone = "neutral",
  action,
}: ProfileEmptyStateProps) => {
  const isError = tone === "error";

  return (
    <View
      accessibilityRole={isError ? "alert" : "summary"}
      style={{
        alignItems: "center",
        gap: 9,
        paddingVertical: 40,
        paddingHorizontal: 24,
        borderRadius: PROFILE_RADIUS.card,
        backgroundColor: SOCIAL_COLORS.surface,
        borderWidth: 1,
        borderColor: SOCIAL_COLORS.border,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isError ? SOCIAL_COLORS.dangerSoft : SOCIAL_COLORS.primarySoft,
        }}
      >
        <Feather
          name={icon}
          size={21}
          color={isError ? SOCIAL_COLORS.danger : SOCIAL_COLORS.primary}
        />
      </View>

      <Text
        maxFontSizeMultiplier={1.2}
        style={{ fontSize: 15.5, fontWeight: "700", color: SOCIAL_COLORS.navy }}
      >
        {title}
      </Text>

      <Text
        maxFontSizeMultiplier={1.2}
        style={{
          maxWidth: 380,
          fontSize: 13.5,
          lineHeight: 19,
          textAlign: "center",
          color: SOCIAL_COLORS.muted,
        }}
      >
        {body}
      </Text>

      {action ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={action.label}
          onPress={action.onPress}
          className="items-center justify-center active:opacity-85"
          style={{
            marginTop: 8,
            minHeight: 44,
            paddingHorizontal: 22,
            borderRadius: PROFILE_RADIUS.control,
            backgroundColor: SOCIAL_COLORS.primary,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF" }}>
            {action.label}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export default ProfileEmptyState;
