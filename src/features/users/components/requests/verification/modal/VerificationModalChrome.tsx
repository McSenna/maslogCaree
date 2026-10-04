import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";
import { PALETTE } from "@/theme/palette";

export const VerificationModalHeader = ({ onClose }: { onClose: () => void }) => {
  const { classes, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View className="flex-row items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60">
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 items-center justify-center">
          <Feather name="shield" size={20} color={PALETTE.blue[600]} />
        </View>
        <View>
          <Text className={`text-[17px] font-extrabold ${classes.textPrimary}`}>
            Resident Identity Verification
          </Text>
          <Text className={`text-[12px] ${classes.textMuted}`}>
            Compare registration information against submitted Government ID
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close"
        hitSlop={8}
        className="w-8 h-8 rounded-full items-center justify-center bg-slate-200/80 dark:bg-slate-700"
      >
        <Feather name="x" size={16} color={isDark ? PALETTE.slate[200] : PALETTE.slate[700]} />
      </Pressable>
    </View>
  );
};

export const VerificationModalLoading = () => {
  const { classes } = useTheme();
  return (
    <View className="py-24 items-center justify-center gap-3">
      <ActivityIndicator size="large" color={PALETTE.blue[600]} />
      <Text className={`text-sm ${classes.textMuted}`}>Loading verification details...</Text>
    </View>
  );
};

export const VerificationModalError = ({ message }: { message?: string | null }) => (
  <View className="py-20 px-6 items-center justify-center gap-2">
    <Feather name="alert-circle" size={32} color={PALETTE.red[500]} />
    <Text className="text-sm text-red-500 font-semibold text-center">
      {message || "Verification request could not be loaded."}
    </Text>
  </View>
);
