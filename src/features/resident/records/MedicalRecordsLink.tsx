import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";


const MedicalRecordsLink = ({ completedCount }: { completedCount: number }) => {
  return (
    <Link href="/resident/medical-records" asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Open your medical record history"
        className="flex-row items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 active:opacity-80"
      >
        <View className="h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
          <Feather name="file-text" size={16} color="#059669" />
        </View>
        <View className="min-w-0 flex-1 gap-0.5">
          <Text className="text-sm font-semibold text-slate-900">Medical record history</Text>
          <Text className="text-xs text-slate-500" numberOfLines={1}>
            {completedCount === 0
              ? "Records from completed visits appear here"
              : `${completedCount} completed ${completedCount === 1 ? "visit" : "visits"} on file`}
          </Text>
        </View>
        <Feather name="chevron-right" size={18} color="#94A3B8" />
      </Pressable>
    </Link>
  );
};

export default MedicalRecordsLink;
