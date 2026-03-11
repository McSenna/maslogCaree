import { Text, View } from "react-native";

type ProfileInfoItemProps = {
  label: string;
  value?: string | number | null;
};

export default function ProfileInfoItem({ label, value }: ProfileInfoItemProps) {
  const displayValue =
    value === null || value === undefined || value === "" ? "Not provided" : String(value);

  return (
    <View className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
      <Text className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </Text>
      <Text className="mt-1 text-sm font-medium text-slate-800">{displayValue}</Text>
    </View>
  );
}

