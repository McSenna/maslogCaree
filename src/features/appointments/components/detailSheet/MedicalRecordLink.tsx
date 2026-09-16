import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { QUEUE_RADIUS, type QueuePalette } from "@/components/appointmentQueue/queueTheme";

type Props = {
  recordId: string | null;
  palette: QueuePalette;
  loading: boolean;
  error?: string | null;
  onPress: (recordId: string) => void;
};

const MedicalRecordLink = ({
  recordId,
  palette,
  loading,
  error,
  onPress,
}: Props) => {
  if (!recordId) return null;

  const tone = palette.statuses.completed;

  return (
    <View className="w-full gap-2">
      <Text
        className="text-[11.5px] font-bold uppercase"
        style={{ color: palette.subtle, letterSpacing: 0.6 }}
      >
        Medical Record
      </Text>

      <Pressable
        onPress={() => onPress(recordId)}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="View the medical record from this appointment"
        accessibilityState={{ busy: loading, disabled: loading }}
        className="w-full flex-row items-center gap-3 px-3.5 py-3.5 active:opacity-80"
        style={{
          borderRadius: QUEUE_RADIUS.control,
          backgroundColor: tone.bg,
          opacity: loading ? 0.7 : 1,
        }}
      >
        <View
          className="items-center justify-center"
          style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: palette.panelBg }}
        >
          {loading ? (
            <ActivityIndicator size="small" color={tone.dot} />
          ) : (
            <MaterialCommunityIcons name="clipboard-pulse-outline" size={18} color={tone.dot} />
          )}
        </View>

        <View className="min-w-0 flex-1 gap-0.5">
          <Text className="text-[13.5px] font-bold" style={{ color: tone.fg }}>
            {loading ? "Opening your record…" : "View medical record"}
          </Text>
          <Text className="text-[11.5px]" style={{ color: tone.fg, opacity: 0.85 }}>
            What your health worker recorded during this visit
          </Text>
        </View>

        {loading ? null : <Feather name="chevron-right" size={18} color={tone.dot} />}
      </Pressable>

      {error ? (
        <Text className="text-[12px]" style={{ color: palette.statuses.declined.fg }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

export default MedicalRecordLink;
