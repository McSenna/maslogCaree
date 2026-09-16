import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

const RejectHeader = ({
  residentName,
  onCancel,
  loading,
  classes,
}: {
  residentName: string;
  onCancel: () => void;
  loading: boolean;
  classes: { textPrimary: string; textMuted: string };
}) => (
  <View className="flex-row items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
    <View className="flex-row items-center gap-2.5">
      <View className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 items-center justify-center">
        <Feather name="alert-triangle" size={16} color="#DC2626" />
      </View>
      <View>
        <Text className={`text-[16px] font-bold ${classes.textPrimary}`}>Reject Registration</Text>
        <Text className={`text-[12px] ${classes.textMuted}`} numberOfLines={1}>
          Target Resident: <Text className="font-semibold">{residentName}</Text>
        </Text>
      </View>
    </View>

    <Pressable
      onPress={loading ? undefined : onCancel}
      accessibilityRole="button"
      className="w-7 h-7 rounded-full items-center justify-center bg-slate-100 dark:bg-slate-800"
    >
      <Feather name="x" size={14} color="#64748B" />
    </Pressable>
  </View>
);

export default RejectHeader;
