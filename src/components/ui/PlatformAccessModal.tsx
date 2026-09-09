import { useEffect, useRef } from "react";
import {
  Modal,
  Platform,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LANDING_COLORS } from "@/config/landingAssets";
import { MOBILE_ONLY_NOTICE } from "@/config/platformAccess";

type PlatformAccessModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  supporting?: string;
  actionLabel?: string;
};

/**
 * "Mobile App Required" — the dialog a resident sees after a correct password
 * on the web.
 *
 * It is a real MaslogCare surface rather than `window.alert`, which
 * react-native-web would either swallow or render as a browser chrome popup
 * with no branding, no styling and no keyboard handling. The copy explains the
 * policy instead of reporting a failure: the credentials were right, and the
 * only thing wrong is the client they were used from.
 *
 * Dismissal is intentionally single-purpose. There is no "continue anyway",
 * because there is nothing to continue to: the server issued no session.
 */
export default function PlatformAccessModal({
  visible,
  onClose,
  title = MOBILE_ONLY_NOTICE.title,
  message = MOBILE_ONLY_NOTICE.message,
  supporting = MOBILE_ONLY_NOTICE.supporting,
  actionLabel = MOBILE_ONLY_NOTICE.action,
}: PlatformAccessModalProps) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 420;
  const actionRef = useRef<View | null>(null);

  // Move focus to the only action when the dialog opens, so keyboard and
  // screen-reader users land inside it rather than behind it on the login form.
  useEffect(() => {
    if (!visible || Platform.OS !== "web") return;
    const node = actionRef.current as unknown as { focus?: () => void } | null;
    const timer = setTimeout(() => node?.focus?.(), 50);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <View
        className="flex-1 items-center justify-center px-5"
        style={{ backgroundColor: "rgba(8, 21, 47, 0.45)" }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Dismiss ${title}`}
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          accessibilityViewIsModal
          accessibilityRole={Platform.OS === "web" ? ("dialog" as any) : undefined}
          accessibilityLabel={title}
          className="w-full items-center"
          style={{
            maxWidth: 420,
            borderRadius: 22,
            borderWidth: 1,
            borderColor: "#DCE8FA",
            backgroundColor: LANDING_COLORS.white,
            paddingHorizontal: isNarrow ? 22 : 28,
            paddingTop: 28,
            paddingBottom: 22,
            ...Platform.select({
              web: { boxShadow: "0px 18px 48px rgba(8, 21, 47, 0.16)" } as any,
              default: {
                elevation: 8,
                shadowColor: "#08152F",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.16,
                shadowRadius: 28,
              },
            }),
          }}
        >
          <View
            className="items-center justify-center"
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: LANDING_COLORS.softBlue,
            }}
          >
            <MaterialCommunityIcons
              name="cellphone-check"
              size={30}
              color={LANDING_COLORS.primaryBlue}
            />
          </View>

          <Text
            accessibilityRole="header"
            className="text-center font-bold"
            style={{
              marginTop: 18,
              fontSize: isNarrow ? 19 : 21,
              color: LANDING_COLORS.navy,
              letterSpacing: -0.2,
            }}
          >
            {title}
          </Text>

          <Text
            className="text-center"
            style={{
              marginTop: 10,
              fontSize: isNarrow ? 14 : 14.5,
              lineHeight: isNarrow ? 21 : 22,
              color: LANDING_COLORS.mutedText,
            }}
          >
            {message}
          </Text>

          {supporting ? (
            <View
              className="w-full"
              style={{
                marginTop: 18,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: "#DDEBFF",
                backgroundColor: "#F4F9FF",
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
            >
              <Text
                className="text-center"
                style={{ fontSize: 12.5, lineHeight: 18.5, color: "#3B5375" }}
              >
                {supporting}
              </Text>
            </View>
          ) : null}

          <Pressable
            ref={actionRef}
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
            focusable
            onPress={onClose}
            android_ripple={{ color: "rgba(255,255,255,0.24)" }}
            className="w-full items-center justify-center active:opacity-90"
            style={{
              marginTop: 22,
              height: 50,
              borderRadius: 12,
              backgroundColor: LANDING_COLORS.primaryBlue,
              ...Platform.select({ web: { cursor: "pointer" } as any }),
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 15.5, fontWeight: "700" }}>
              {actionLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
