import { Text, TextInput, View } from "react-native";

const RemarksField = ({
  remarks,
  onChangeText,
  error,
  required,
  isDark,
  textPrimary,
}: {
  remarks: string;
  onChangeText: (text: string) => void;
  error: string;
  required: boolean;
  isDark: boolean;
  textPrimary: string;
}) => (
  <View className="mt-1">
    <Text className={`text-[12.5px] font-semibold mb-1 ${textPrimary}`}>
      {required ? "Remarks / Detailed Explanation *" : "Remarks (Optional)"}
    </Text>
    <TextInput
      value={remarks}
      onChangeText={onChangeText}
      placeholder="Enter remarks explaining what the resident needs to correct..."
      placeholderTextColor="#94A3B8"
      multiline
      numberOfLines={3}
      style={{
        minHeight: 70,
        textAlignVertical: "top",
      }}
      className={[
        "w-full p-3 rounded-xl border text-[13px]",
        error
          ? "border-red-500 bg-red-50/20"
          : isDark
            ? "border-slate-700 bg-slate-800 text-white"
            : "border-slate-200 bg-white text-slate-900",
      ].join(" ")}
    />
    {error ? <Text className="text-red-500 text-[11px] mt-1 font-medium">{error}</Text> : null}
  </View>
);

export default RemarksField;
