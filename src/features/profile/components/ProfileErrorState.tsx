import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { PROFILE_COLORS, PROFILE_RADIUS } from "../config/profileTheme";

type ProfileErrorStateProps = {
  onRetry?: () => void;
  /** Optional safe summary. Raw API/server text must never reach this (§45). */
  message?: string;
};

/** Shown when the profile cannot be resolved from the current session. */
const ProfileErrorState = ({ onRetry, message }: ProfileErrorStateProps) => (
  <View
    accessibilityRole="alert"
    style={{
      alignItems: "center",
      gap: 8,
      paddingVertical: 44,
      paddingHorizontal: 24,
      borderRadius: PROFILE_RADIUS.card,
      backgroundColor: PROFILE_COLORS.surface,
      borderWidth: 1,
      borderColor: PROFILE_COLORS.border,
    }}
  >
    <View
      style={{
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: PROFILE_COLORS.dangerSoft,
      }}
    >
      <Feather name="alert-circle" size={24} color={PROFILE_COLORS.danger} />
    </View>

    <Text
      style={{
        marginTop: 6,
        fontSize: 16.5,
        fontWeight: "700",
        color: PROFILE_COLORS.navy,
      }}
    >
      Unable to load your profile.
    </Text>

    <Text
      style={{
        fontSize: 14,
        textAlign: "center",
        color: PROFILE_COLORS.muted,
      }}
    >
      {message ?? "Please try again."}
    </Text>

    {onRetry ? (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Retry loading profile"
        onPress={onRetry}
        className="flex-row items-center justify-center active:opacity-85"
        style={{
          marginTop: 12,
          minHeight: 44,
          paddingHorizontal: 24,
          borderRadius: PROFILE_RADIUS.control,
          backgroundColor: PROFILE_COLORS.primary,
        }}
      >
        <Text style={{ fontSize: 14.5, fontWeight: "700", color: "#FFFFFF" }}>
          Retry
        </Text>
      </Pressable>
    ) : null}
  </View>
);

export default ProfileErrorState;
