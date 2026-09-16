import { Pressable, Text, View } from "react-native";
import { REJECTION_REASONS } from "@/config/idVerification";

const ReasonList = ({
  selectedReason,
  onSelect,
  textPrimary,
}: {
  selectedReason: string;
  onSelect: (reason: string) => void;
  textPrimary: string;
}) => (
  <View className="gap-2 mb-3">
    {REJECTION_REASONS.map((reason) => {
      const isSelected = selectedReason === reason;
      return (
        <Pressable
          key={reason}
          onPress={() => onSelect(reason)}
          accessibilityRole="radio"
          accessibilityState={{ checked: isSelected }}
          className={[
            "flex-row items-center p-3 rounded-xl border transition-all",
            isSelected
              ? "border-red-500 bg-red-50/60 dark:bg-red-950/30 dark:border-red-700"
              : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40",
          ].join(" ")}
        >
          <View
            className={[
              "w-4 h-4 rounded-full border items-center justify-center mr-3",
              isSelected ? "border-red-600 bg-red-600" : "border-slate-300 dark:border-slate-600",
            ].join(" ")}
          >
            {isSelected && <View className="w-1.5 h-1.5 rounded-full bg-white" />}
          </View>
          <Text
            className={[
              "text-[13px] flex-1",
              isSelected ? "font-bold text-red-700 dark:text-red-300" : textPrimary,
            ].join(" ")}
          >
            {reason}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

export default ReasonList;
