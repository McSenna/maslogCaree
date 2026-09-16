import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import ModalHeader from "./ModalHeader";

export { SectionCard } from "./SectionCard";

export const SHEET_WIDTH = 768;

export const PANEL_TWO_COLUMN_WIDTH = 640;

const CompleteModalShell = ({
  visible,
  onRequestClose,
  dismissible,
  title,
  subtitle,
  badge,
  footer,
  children,
  onLayoutWidth,
}: {
  visible: boolean;
  onRequestClose: () => void;
  dismissible: boolean;
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  onLayoutWidth?: (width: number) => void;
}) => {
  const palette = useQueuePalette();
  const { width } = useWindowDimensions();
  const isSheet = width < SHEET_WIDTH;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isSheet ? "slide" : "fade"}
      onRequestClose={() => dismissible && onRequestClose()}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className={`flex-1 ${isSheet ? "justify-end" : "items-center justify-center p-4"}`}
        style={{ backgroundColor: "rgba(15,37,87,0.35)" }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close without completing"
          onPress={() => dismissible && onRequestClose()}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          className="w-full overflow-hidden"
          onLayout={(event) => onLayoutWidth?.(event.nativeEvent.layout.width)}
          style={{
            maxWidth: isSheet ? undefined : 920,
            maxHeight: isSheet ? "94%" : "90%",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderBottomLeftRadius: isSheet ? 0 : 24,
            borderBottomRightRadius: isSheet ? 0 : 24,
            backgroundColor: palette.pageBg,
          }}
        >
          {isSheet ? (
            <View className="items-center pb-1 pt-2.5">
              <View style={{ width: 44, height: 4.5, borderRadius: 3, backgroundColor: palette.divider }} />
            </View>
          ) : null}

          <ModalHeader
            title={title}
            subtitle={subtitle}
            badge={badge}
            dismissible={dismissible}
            onRequestClose={onRequestClose}
            palette={palette}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 14 }}
          >
            {children}
          </ScrollView>

          {footer ? (
            <View
              className="px-4 py-3.5"
              style={{
                backgroundColor: palette.panelBg,
                borderTopWidth: 1,
                borderTopColor: palette.divider,
              }}
            >
              {footer}
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CompleteModalShell;
