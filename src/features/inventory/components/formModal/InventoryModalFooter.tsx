import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useKeyboardInset } from "@/hooks/useKeyboardInset";

import { CONTROL_HEIGHT, RADIUS, useInventoryPalette } from "../inventoryTheme";

type Props = {
  isMobile: boolean;
  submitLabel: string;
  submitDisabled: boolean;
  submitting: boolean;
  onSubmit: () => void;
  onClose: () => void;
};

const InventoryModalFooter = ({
  isMobile,
  submitLabel,
  submitDisabled,
  submitting,
  onSubmit,
  onClose,
}: Props) => {
  const palette = useInventoryPalette();
  const insets = useSafeAreaInsets();
  // The sheet already sits on top of the keyboard, so the home-indicator gap
  // would only add dead space between the buttons and the keys.
  const keyboardInset = useKeyboardInset();
  const bottomGap = keyboardInset > 0 ? 12 : Math.max(insets.bottom, 12) + 4;

  return (
    <View
      className={`flex-row gap-2.5 ${isMobile ? "px-4 pt-3" : "px-5 py-4"}`}
      style={{
        borderTopWidth: 1,
        borderTopColor: palette.divider,
        ...(isMobile ? { paddingBottom: bottomGap } : null),
      }}
    >
      <Pressable
        onPress={onClose}
        disabled={submitting}
        accessibilityRole="button"
        accessibilityLabel="Cancel"
        className="flex-1 items-center justify-center border active:opacity-85"
        style={{
          height: CONTROL_HEIGHT,
          borderRadius: RADIUS.control,
          backgroundColor: palette.cardBg,
          borderColor: palette.cardBorder,
        }}
      >
        <Text className="text-[14px] font-semibold" style={{ color: palette.body }}>
          Cancel
        </Text>
      </Pressable>

      <Pressable
        onPress={onSubmit}
        disabled={submitDisabled || submitting}
        accessibilityRole="button"
        accessibilityLabel={submitLabel}
        accessibilityState={{ disabled: submitDisabled || submitting }}
        className="flex-1 flex-row items-center justify-center gap-2 active:opacity-85"
        style={{
          height: CONTROL_HEIGHT,
          borderRadius: RADIUS.control,
          backgroundColor: palette.primary,
          opacity: submitDisabled || submitting ? 0.55 : 1,
        }}
      >
        {submitting ? <ActivityIndicator size="small" color="#FFFFFF" /> : null}
        <Text className="text-[14px] font-semibold text-white">
          {submitting ? "Saving…" : submitLabel}
        </Text>
      </Pressable>
    </View>
  );
};

export default InventoryModalFooter;
