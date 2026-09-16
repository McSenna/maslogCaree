import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MISSION_RADIUS, useMissionSchedulePalette } from "./missionScheduleTheme";

type MissionScheduleSheetProps = {
  visible: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
  footer: ReactNode;
};

export const MISSION_SHEET_BREAKPOINT = 768;

const DESKTOP_WIDTH = 720;

const MissionScheduleSheet = ({
  visible,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: MissionScheduleSheetProps) => {
  const palette = useMissionSchedulePalette();
  const { width } = useWindowDimensions();
  const safeArea = useSafeAreaInsets();
  const isSheet = width < MISSION_SHEET_BREAKPOINT;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isSheet ? "slide" : "fade"}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className={`flex-1 ${isSheet ? "justify-end" : "items-center justify-center p-5"}`}
        style={{ backgroundColor: palette.backdrop }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close without creating a mission schedule"
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          className="w-full overflow-hidden"
          style={{
            maxWidth: isSheet ? undefined : DESKTOP_WIDTH,
            maxHeight: isSheet ? "94%" : "88%",
            borderTopLeftRadius: MISSION_RADIUS.sheet,
            borderTopRightRadius: MISSION_RADIUS.sheet,
            borderBottomLeftRadius: isSheet ? 0 : MISSION_RADIUS.sheet,
            borderBottomRightRadius: isSheet ? 0 : MISSION_RADIUS.sheet,
            backgroundColor: palette.surface,
            ...palette.shadow,
          }}
        >
          {isSheet ? (
            <View className="items-center pb-1 pt-3">
              <View
                accessibilityElementsHidden
                importantForAccessibility="no"
                style={{ width: 42, height: 4.5, borderRadius: 3, backgroundColor: palette.border }}
              />
            </View>
          ) : null}

          <View className="flex-row items-start gap-3 px-6 pb-4 pt-5">
            <View className="min-w-0 flex-1">
              <Text
                accessibilityRole="header"
                className={isSheet ? "text-[24px] font-bold" : "text-[27px] font-bold"}
                style={{ color: palette.heading, letterSpacing: -0.4 }}
              >
                {title}
              </Text>
              <Text className="mt-1.5 text-[13.5px] leading-[19px]" style={{ color: palette.muted }}>
                {subtitle}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close without creating a mission schedule"
              hitSlop={12}
              className="h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: palette.subtle }}
            >
              <Feather name="x" size={17} color={palette.muted} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          >
            {children}
          </ScrollView>

          <View
            className="px-5 pt-3.5"
            style={{
              borderTopWidth: 1,
              borderTopColor: palette.divider,
              backgroundColor: palette.surface,
              paddingBottom: 14 + (isSheet ? safeArea.bottom : 0),
            }}
          >
            {footer}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default MissionScheduleSheet;
