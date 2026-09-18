import { Modal, Pressable, ScrollView, View } from "react-native";

import BottomSheet, { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
import { useTheme } from "@/contexts/ThemeContext";
import { useDialogPresentation } from "@/hooks/useDialogPresentation";

import RejectBody from "./reject/RejectBody";
import RejectFooter from "./reject/RejectFooter";
import RejectHeader from "./reject/RejectHeader";
import { useRejectDraft } from "./reject/useRejectDraft";

type RejectRequestModalProps = {
  visible: boolean;
  residentName: string;
  loading?: boolean;
  onConfirm: (reason: string, remarks?: string) => void;
  onCancel: () => void;
};

const RejectRequestModal = ({
  visible,
  residentName,
  loading = false,
  onConfirm,
  onCancel,
}: RejectRequestModalProps) => {
  const { classes, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const presentation = useDialogPresentation();
  const draft = useRejectDraft(visible, onConfirm);

  // A rejection in flight must not be abandoned half-sent.
  const handleCancel = () => {
    if (loading) return;
    onCancel();
  };

  if (!visible) return null;

  const body = (
    <RejectBody
      draft={draft}
      isDark={isDark}
      textPrimary={classes.textPrimary}
      textSecondary={classes.textSecondary}
    />
  );

  const footer = (
    <RejectFooter
      loading={loading}
      onCancel={handleCancel}
      onConfirm={draft.submit}
      textSecondary={classes.textSecondary}
    />
  );

  if (presentation === "sheet") {
    return (
      <BottomSheet
        visible={visible}
        onClose={handleCancel}
        accessibilityLabel="Reject registration"
        surface={isDark ? "#0F172A" : "#FFFFFF"}
        handleColor={isDark ? "#475569" : "#CBD5E1"}
        header={(requestClose) => (
          <View className="px-5">
            <RejectHeader
              residentName={residentName}
              onCancel={loading ? () => {} : requestClose}
              loading={loading}
              classes={classes}
            />
          </View>
        )}
      >
        <ScrollView
          style={SHEET_SCROLL_STYLE}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {body}
        </ScrollView>

        {/* Pinned: the reason list is long enough to push these off-screen. */}
        <View className="flex-row justify-end gap-2.5 border-t border-slate-200 px-5 pb-1 pt-3 dark:border-slate-700">
          {footer}
        </View>
      </BottomSheet>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={loading ? undefined : onCancel}
    >
      <View
        className="flex-1 items-center justify-center px-4"
        style={{ backgroundColor: "rgba(15, 23, 42, 0.65)" }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancel rejection"
          onPress={handleCancel}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          accessibilityViewIsModal
          className={[
            "w-full max-w-[500px] overflow-hidden rounded-2xl border p-5",
            isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white",
          ].join(" ")}
          style={{ maxHeight: "85%", boxShadow: "0px 16px 36px rgba(0,0,0,0.25)" }}
        >
          <RejectHeader
            residentName={residentName}
            onCancel={handleCancel}
            loading={loading}
            classes={classes}
          />

          <ScrollView
            className="mb-2 mt-3"
            style={{ flexShrink: 1, minHeight: 0 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {body}
          </ScrollView>

          <View className="flex-row justify-end gap-2.5 border-t border-slate-200 pt-3 dark:border-slate-700">
            {footer}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RejectRequestModal;
