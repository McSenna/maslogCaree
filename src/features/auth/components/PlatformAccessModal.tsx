import { useEffect, useRef } from "react";
import { Modal, Platform, Pressable, View, useWindowDimensions } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";
import { MOBILE_ONLY_NOTICE } from "@/config/platformAccess";
import PlatformAccessAction from "./platformAccess/PlatformAccessAction";
import PlatformAccessBody from "./platformAccess/PlatformAccessBody";

type PlatformAccessModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  supporting?: string;
  actionLabel?: string;
};

const PlatformAccessModal = ({
  visible,
  onClose,
  title = MOBILE_ONLY_NOTICE.title,
  message = MOBILE_ONLY_NOTICE.message,
  supporting = MOBILE_ONLY_NOTICE.supporting,
  actionLabel = MOBILE_ONLY_NOTICE.action,
}: PlatformAccessModalProps) => {
  const { width } = useWindowDimensions();
  const isNarrow = width < 420;
  const actionRef = useRef<View | null>(null);

  useEffect(() => {
    if (!visible || Platform.OS !== "web") return;
    const node = actionRef.current as unknown as { focus?: () => void } | null;
    const timer = setTimeout(() => node?.focus?.(), 50);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} accessibilityViewIsModal>
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
          role={Platform.OS === "web" ? "dialog" : undefined}
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
              web: { boxShadow: "0px 18px 48px rgba(8, 21, 47, 0.16)" },
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
          <PlatformAccessBody title={title} message={message} supporting={supporting} isNarrow={isNarrow} />
          <PlatformAccessAction ref={actionRef} label={actionLabel} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default PlatformAccessModal;
