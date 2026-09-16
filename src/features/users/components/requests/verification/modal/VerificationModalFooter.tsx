import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

type Props = {
  isPending: boolean;
  approving: boolean;
  rejecting: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
};

const VerificationModalFooter = ({
  isPending,
  approving,
  rejecting,
  onClose,
  onApprove,
  onReject,
}: Props) => {
  const { classes } = useTheme();
  const busy = approving || rejecting;

  return (
    <View className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 flex-row items-center justify-between">
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        className="h-11 px-4 justify-center rounded-xl border border-slate-200 dark:border-slate-700"
      >
        <Text className={`text-sm font-semibold ${classes.textSecondary}`}>Close</Text>
      </Pressable>

      <View className="flex-row items-center gap-3">
        {isPending && (
          <>
            <Pressable
              onPress={onReject}
              disabled={busy}
              accessibilityRole="button"
              className="h-11 px-4 flex-row items-center gap-2 rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30"
              style={{ opacity: busy ? 0.6 : 1 }}
            >
              <Feather name="x-circle" size={15} color="#DC2626" />
              <Text className="text-sm font-bold text-red-600 dark:text-red-400">
                Reject Request
              </Text>
            </Pressable>

            <Pressable
              onPress={onApprove}
              disabled={busy}
              accessibilityRole="button"
              className="h-11 px-5 flex-row items-center gap-2 rounded-xl bg-green-600 shadow-sm"
              style={{ opacity: busy ? 0.75 : 1 }}
            >
              {approving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Feather name="check-circle" size={15} color="#fff" />
              )}
              <Text className="text-sm font-bold text-white">
                {approving ? "Approving..." : "Approve Resident"}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

export default VerificationModalFooter;
