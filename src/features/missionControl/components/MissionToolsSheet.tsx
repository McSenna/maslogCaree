import type { ReactNode } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { QueuePalette } from "@/components/appointmentQueue/queueTheme";

type MissionToolsSheetProps = {
  visible: boolean;
  onClose: () => void;
  isPhone: boolean;
  palette: QueuePalette;
  children: ReactNode;
};

/**
 * The mission scheduling workspace, behind the Add Mission control.
 *
 * A bottom sheet on a phone and a centred dialog on a desktop — the same
 * component either way, because the contents are identical and only the frame
 * changes. Only roles that may manage a mission can open it, and the API
 * refuses the rest regardless of what is rendered.
 */
export default function MissionToolsSheet({
  visible,
  onClose,
  isPhone,
  palette,
  children,
}: MissionToolsSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType={isPhone ? "slide" : "fade"}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        className={`flex-1 ${isPhone ? "justify-end" : "items-center justify-center p-4"}`}
        style={{ backgroundColor: "rgba(15,37,87,0.35)" }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close mission scheduling"
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          className="w-full overflow-hidden"
          style={{
            maxWidth: isPhone ? undefined : 640,
            maxHeight: "92%",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderBottomLeftRadius: isPhone ? 0 : 24,
            borderBottomRightRadius: isPhone ? 0 : 24,
            backgroundColor: palette.panelBg,
          }}
        >
          {isPhone ? (
            <View className="items-center pb-1 pt-2.5">
              <View
                style={{ width: 44, height: 4.5, borderRadius: 3, backgroundColor: palette.divider }}
              />
            </View>
          ) : null}

          <View
            className="flex-row items-center justify-between px-5 py-4"
            style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
          >
            <Text
              accessibilityRole="header"
              className="text-[17px] font-bold"
              style={{ color: palette.heading }}
            >
              Mission Scheduling
            </Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close mission scheduling"
              hitSlop={12}
              className="h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: palette.skeleton }}
            >
              <Feather name="x" size={17} color={palette.muted} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, gap: 20 }}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
