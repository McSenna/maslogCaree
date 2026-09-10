import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** Renders the confirm button in red for actions that take access away. */
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * The app's confirmation dialog, used instead of Alert.alert so destructive
 * actions read as part of MaslogCare rather than an OS popup, and so the
 * confirm button can show its own pending state.
 *
 * ## Why this unmounts instead of staying mounted and hidden
 *
 * On web, every React Native modal is portalled into its own `<div>` appended
 * to `document.body`, and react-native-web gives all of them the same
 * `z-index: 9999`. Equal z-index means the last node in the document wins, and
 * a portal is appended when its component *first renders* — not when it
 * becomes visible.
 *
 * That is a trap for a confirmation dialog. The modals it confirms for —
 * Release Stock, Add Stock, User Details — all bail out with `if (!item)
 * return null` until something is selected, so their portals are appended
 * later than a confirmation that mounted with the screen. The dialog then
 * opens *underneath* the modal that asked for it: present, focus-trapping, and
 * completely invisible.
 *
 * Returning null while closed means this mounts at the moment it opens, which
 * is always after whatever opened it, so it is always on top. It costs the
 * fade-out on close — the component is gone before the animation can run — and
 * a dialog that cannot be seen is the worse of the two.
 */
export default function ConfirmationModal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const { classes, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const confirmBg = destructive ? "#EF4444" : "#2563EB";

  // See the note above: mounting only while open is what keeps this above the
  // modal that opened it. `visible` is still passed through so the entry
  // animation and the native back-button handling work unchanged.
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={loading ? undefined : onCancel}
    >
      <View className="flex-1 items-center justify-center px-6">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={cancelLabel}
          onPress={loading ? undefined : onCancel}
          className="absolute inset-0 bg-black/45"
        />

        <View
          accessibilityViewIsModal
          className={["w-full max-w-[440px] rounded-2xl border p-5", isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"].join(" ")}
        >
          <Text className={`text-[17px] font-bold ${classes.textPrimary}`}>{title}</Text>
          <Text className={`mt-2 text-[13.5px] leading-relaxed ${classes.textMuted}`}>{message}</Text>

          <View className="mt-5 flex-row justify-end gap-2.5">
            <Pressable
              onPress={onCancel}
              disabled={loading}
              accessibilityRole="button"
              className={["h-11 justify-center rounded-xl border px-4", isDark ? "border-slate-700" : "border-slate-200"].join(" ")}
              style={{ opacity: loading ? 0.5 : 1 }}
            >
              <Text className={`text-sm font-semibold ${classes.textSecondary}`}>{cancelLabel}</Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              disabled={loading}
              accessibilityRole="button"
              className="h-11 min-w-[132px] flex-row items-center justify-center gap-2 rounded-xl px-4"
              style={{ backgroundColor: confirmBg, opacity: loading ? 0.8 : 1 }}
            >
              {loading ? <ActivityIndicator size="small" color="#fff" /> : null}
              <Text className="text-sm font-semibold text-white">{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
