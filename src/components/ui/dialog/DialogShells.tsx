import { Feather } from "@expo/vector-icons";
import { type ReactNode, useId } from "react";
import { Modal, Platform, Pressable, ScrollView, View, useWindowDimensions } from "react-native";

import BottomSheet, { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";
import { useFocusTrap, useWebModalBehavior } from "@/hooks/useWebModalBehavior";

import DialogHeader from "./DialogHeader";

export type DialogShellProps = {
  visible: boolean;
  title: string;
  icon: keyof typeof Feather.glyphMap;
  tint?: string;
  tintSoft?: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: number;
};

const CONTENT_PADDING = 20;

/** Centred dialog for desktop-width viewports. */
export const DialogModalShell = ({
  visible,
  title,
  icon,
  tint,
  tintSoft,
  onClose,
  children,
  maxWidth = 560,
}: DialogShellProps) => {
  const { width, height } = useWindowDimensions();
  const palette = useResidentDialogPalette();
  const titleId = useId();

  useWebModalBehavior(visible, onClose);
  const attachFocusTrap = useFocusTrap(visible);

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          backgroundColor: "rgba(15, 23, 42, 0.45)",
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Close ${title}`}
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          ref={attachFocusTrap as never}
          accessibilityViewIsModal
          {...Platform.select({
            web: { role: "dialog", "aria-modal": true, "aria-labelledby": titleId } as object,
          })}
          style={{
            width: Math.min(maxWidth, width - 32),
            maxHeight: Math.round(height * 0.9),
            borderRadius: 20,
            backgroundColor: palette.surface,
            borderColor: palette.border,
            borderWidth: 1,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <DialogHeader
            palette={palette}
            title={title}
            icon={icon}
            tint={tint}
            tintSoft={tintSoft}
            titleId={titleId}
            onClose={onClose}
          />

          <ScrollView
            style={{ flexShrink: 1 }}
            contentContainerStyle={{ padding: CONTENT_PADDING, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

/** Bottom sheet for phone-width viewports, web included. */
export const DialogSheetShell = ({
  visible,
  title,
  icon,
  tint,
  tintSoft,
  onClose,
  children,
}: DialogShellProps) => {
  const palette = useResidentDialogPalette();

  if (!visible) return null;

  return (
    <BottomSheet
      visible
      onClose={onClose}
      accessibilityLabel={title}
      surface={palette.surface}
      handleColor={palette.isDark ? "#475569" : "#CBD5E1"}
      maxHeightRatio={0.92}
      header={(requestClose) => (
        <DialogHeader
          palette={palette}
          title={title}
          icon={icon}
          tint={tint}
          tintSoft={tintSoft}
          onClose={requestClose}
        />
      )}
    >
      {/* SHEET_SCROLL_STYLE carries the sizing; adding `flex: 1` collapses it. */}
      <ScrollView
        style={SHEET_SCROLL_STYLE}
        contentContainerStyle={{ padding: CONTENT_PADDING, paddingBottom: CONTENT_PADDING }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </BottomSheet>
  );
};
