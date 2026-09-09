import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import {
  PROFILE_COLORS,
  PROFILE_RADIUS,
  PROFILE_SHADOW,
} from "../config/profileTheme";
import ProfileOverlay from "./ProfileOverlay";

export type ProfileNotice = {
  title: string;
  message: string;
};

type ProfileNoticeModalProps = {
  notice: ProfileNotice | null;
  onClose: () => void;
};

/**
 * In-app notice dialog.
 *
 * The profile never calls `window.alert`, so informational messages need a
 * surface of their own that matches the rest of the product (§25, §58).
 */
const ProfileNoticeModal = ({ notice, onClose }: ProfileNoticeModalProps) => (
  <ProfileOverlay
    visible={Boolean(notice)}
    onClose={onClose}
    accessibilityLabel={notice?.title ?? "Notice"}
  >
    <View
      style={{
        width: "100%",
        maxWidth: 400,
        padding: 22,
        borderRadius: PROFILE_RADIUS.card,
        backgroundColor: PROFILE_COLORS.surface,
        ...PROFILE_SHADOW.modal,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: PROFILE_COLORS.primarySoft,
        }}
      >
        <Feather name="info" size={22} color={PROFILE_COLORS.primary} />
      </View>

      <Text
        accessibilityRole="header"
        style={{
          marginTop: 14,
          fontSize: 18,
          fontWeight: "700",
          color: PROFILE_COLORS.navy,
        }}
      >
        {notice?.title}
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 14,
          lineHeight: 20,
          color: PROFILE_COLORS.muted,
        }}
      >
        {notice?.message}
      </Text>

      {/* Footer. Press feedback rides on the class, not on a style callback:
          a function-form `style` on Pressable is dropped on react-native-web,
          taking the button's fill and height with it — which is exactly how
          this button went missing. */}
      <View style={{ marginTop: 22 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          onPress={onClose}
          className="w-full flex-row items-center justify-center active:opacity-85"
          style={{
            height: 50,
            borderRadius: PROFILE_RADIUS.control,
            backgroundColor: PROFILE_COLORS.primary,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "700", color: "#FFFFFF" }}>
            Got It
          </Text>
        </Pressable>
      </View>
    </View>
  </ProfileOverlay>
);

export default ProfileNoticeModal;
