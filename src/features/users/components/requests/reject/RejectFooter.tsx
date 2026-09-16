import { ActivityIndicator, Pressable, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

const RejectFooter = ({
  loading,
  onCancel,
  onConfirm,
  textSecondary,
}: {
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  textSecondary: string;
}) => (
  <>
    <Pressable
      onPress={onCancel}
      disabled={loading}
      accessibilityRole="button"
      className="h-10 justify-center rounded-xl border border-slate-200 dark:border-slate-700 px-4"
      style={{ opacity: loading ? 0.5 : 1 }}
    >
      <Text className={`text-xs font-semibold ${textSecondary}`}>Cancel</Text>
    </Pressable>

    <Pressable
      onPress={onConfirm}
      disabled={loading}
      accessibilityRole="button"
      className="h-10 min-w-[130px] flex-row items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 shadow-sm"
      style={{ opacity: loading ? 0.75 : 1 }}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Feather name="x-circle" size={14} color="#fff" />
      )}
      <Text className="text-xs font-bold text-white">{loading ? "Rejecting..." : "Reject Request"}</Text>
    </Pressable>
  </>
);

export default RejectFooter;
