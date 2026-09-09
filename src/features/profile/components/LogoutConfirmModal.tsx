import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import {
  PROFILE_COLORS,
  PROFILE_RADIUS,
  PROFILE_SHADOW,
} from "../config/profileTheme";
import ProfileOverlay from "./ProfileOverlay";

type LogoutConfirmModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  busy?: boolean;
};

const ACTION_HEIGHT = 50;

/**
 * Custom sign-out confirmation.
 *
 * Replaces `window.confirm` / `Alert.alert`, which §25 rules out and which the
 * web build could not style to match the rest of the product anyway.
 */
const LogoutConfirmModal = ({
  visible,
  onCancel,
  onConfirm,
  busy = false,
}: LogoutConfirmModalProps) => (
  <ProfileOverlay
    visible={visible}
    onClose={onCancel}
    accessibilityLabel="Log out confirmation"
    // Backdrop tap maps to Cancel, never to Confirm — a stray tap outside the
    // card can dismiss the dialog but can never sign the user out.
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
          backgroundColor: PROFILE_COLORS.dangerSoft,
        }}
      >
        <Feather name="log-out" size={22} color={PROFILE_COLORS.danger} />
      </View>

      <Text
        accessibilityRole="header"
        style={{
          marginTop: 14,
          fontSize: 19,
          fontWeight: "700",
          color: PROFILE_COLORS.navy,
        }}
      >
        Log Out?
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 14,
          lineHeight: 20,
          color: PROFILE_COLORS.muted,
        }}
      >
        Are you sure you want to sign out of MaslogCare?
      </Text>

      {/* Footer — Cancel left, destructive action right. Press feedback rides
          on the class, not on a style callback: a function-form `style` on
          Pressable is dropped on react-native-web, taking the fill with it,
          which left "Log Out" as white text on a white card. */}
      <View style={{ flexDirection: "row", gap: 12, marginTop: 22 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancel"
          onPress={onCancel}
          disabled={busy}
          className="flex-1 flex-row items-center justify-center active:opacity-85"
          style={{
            height: ACTION_HEIGHT,
            borderRadius: PROFILE_RADIUS.control,
            borderWidth: 1,
            borderColor: PROFILE_COLORS.border,
            backgroundColor: PROFILE_COLORS.background,
            opacity: busy ? 0.6 : 1,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "600", color: PROFILE_COLORS.body }}>
            Cancel
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Confirm log out"
          onPress={onConfirm}
          disabled={busy}
          className="flex-1 flex-row items-center justify-center gap-2 active:opacity-85"
          style={{
            height: ACTION_HEIGHT,
            borderRadius: PROFILE_RADIUS.control,
            backgroundColor: PROFILE_COLORS.danger,
            opacity: busy ? 0.7 : 1,
          }}
        >
          {!busy ? <Feather name="log-out" size={16} color="#FFFFFF" /> : null}
          <Text style={{ fontSize: 15, fontWeight: "700", color: "#FFFFFF" }}>
            {busy ? "Logging Out…" : "Log Out"}
          </Text>
        </Pressable>
      </View>
    </View>
  </ProfileOverlay>
);

export default LogoutConfirmModal;
