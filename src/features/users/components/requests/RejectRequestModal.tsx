import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { REJECTION_REASONS } from "@/config/idVerification";
import ReasonList from "./reject/ReasonList";
import RejectFooter from "./reject/RejectFooter";
import RejectHeader from "./reject/RejectHeader";
import RemarksField from "./reject/RemarksField";

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

  const [selectedReason, setSelectedReason] = useState(REJECTION_REASONS[0] || "Invalid ID");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");

  if (!visible) return null;

  const handleSelectReason = (reason: string) => {
    setSelectedReason(reason);
    if (error) setError("");
  };

  const handleRemarksChange = (text: string) => {
    setRemarks(text);
    if (error) setError("");
  };

  const handleConfirm = () => {
    if (selectedReason === "Other" && !remarks.trim()) {
      setError("Please provide specific remarks explaining the rejection.");
      return;
    }
    setError("");
    onConfirm(selectedReason, remarks.trim());
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={loading ? undefined : onCancel}>
      <View className="flex-1 items-center justify-center px-4" style={{ backgroundColor: "rgba(15, 23, 42, 0.65)" }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancel rejection"
          onPress={loading ? undefined : onCancel}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          accessibilityViewIsModal
          className={["w-full max-w-[500px] rounded-2xl border p-5 overflow-hidden", isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"].join(" ")}
          style={{ maxHeight: "85%", boxShadow: "0px 16px 36px rgba(0,0,0,0.25)" }}
        >
          <RejectHeader residentName={residentName} onCancel={onCancel} loading={loading} classes={classes} />

          <ScrollView className="mt-3 mb-2" showsVerticalScrollIndicator={false}>
            <Text className={`text-[13px] mb-2.5 font-medium ${classes.textSecondary}`}>
              Select the primary reason for rejecting this verification request:
            </Text>

            <ReasonList
              selectedReason={selectedReason}
              onSelect={handleSelectReason}
              textPrimary={classes.textPrimary}
            />

            <RemarksField
              remarks={remarks}
              onChangeText={handleRemarksChange}
              error={error}
              required={selectedReason === "Other"}
              isDark={isDark}
              textPrimary={classes.textPrimary}
            />
          </ScrollView>

          <View className="pt-3 border-t border-slate-200 dark:border-slate-700 flex-row justify-end gap-2.5">
            <RejectFooter
              loading={loading}
              onCancel={onCancel}
              onConfirm={handleConfirm}
              textSecondary={classes.textSecondary}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RejectRequestModal;
