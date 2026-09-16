import { Text, View } from "react-native";

type Props = { status?: string };

const TONES = {
  approved: {
    wrap: "bg-green-100 dark:bg-green-900/30",
    dot: "bg-green-600",
    text: "text-green-800 dark:text-green-300",
  },
  rejected: {
    wrap: "bg-red-100 dark:bg-red-900/30",
    dot: "bg-red-600",
    text: "text-red-800 dark:text-red-300",
  },
  pending: {
    wrap: "bg-amber-100 dark:bg-amber-900/30",
    dot: "bg-amber-600",
    text: "text-amber-800 dark:text-amber-300",
  },
} as const;

const VerificationStatusPill = ({ status }: Props) => {
  const tone = TONES[status as keyof typeof TONES] ?? TONES.pending;

  return (
    <View className={`px-2.5 py-0.5 rounded-full flex-row items-center gap-1.5 ${tone.wrap}`}>
      <View className={`w-2 h-2 rounded-full ${tone.dot}`} />
      <Text className={`text-[11px] font-bold uppercase ${tone.text}`}>
        {status || "Pending"}
      </Text>
    </View>
  );
};

export default VerificationStatusPill;
