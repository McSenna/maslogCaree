import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { MISSION_RADIUS, useMissionSchedulePalette } from "./missionScheduleTheme";

type MissionSubmitButtonProps = {
  label: string;
  loadingLabel: string;
  onPress: () => void;
  saving: boolean;
  disabled?: boolean;
};

const MissionSubmitButton = ({
  label,
  loadingLabel,
  onPress,
  saving,
  disabled = false,
}: MissionSubmitButtonProps) => {
  const palette = useMissionSchedulePalette();
  const blocked = saving || disabled;

  return (
    <Pressable
      onPress={onPress}
      disabled={blocked}
      accessibilityRole="button"
      accessibilityLabel={saving ? loadingLabel : label}
      accessibilityState={{ disabled: blocked, busy: saving }}
      className="w-full flex-row items-center justify-center gap-2.5 active:opacity-90"
      style={{
        height: 52,
        borderRadius: MISSION_RADIUS.field,
        backgroundColor: palette.primary,
        opacity: blocked ? 0.55 : 1,
      }}
    >
      {saving ? <ActivityIndicator size="small" color="#FFFFFF" /> : null}
      <Text className="text-[15px] font-bold text-white">{saving ? loadingLabel : label}</Text>
      {saving ? null : <Feather name="arrow-right" size={17} color="#FFFFFF" />}
    </Pressable>
  );
};

export const MissionSecurityNote = () => {
  const palette = useMissionSchedulePalette();

  return (
    <View className="w-full flex-row items-center justify-center gap-1.5 pt-2.5">
      <Feather name="lock" size={11} color={palette.faint} />
      <Text className="text-center text-[11.5px]" style={{ color: palette.faint }}>
        Your data is secure and used only for community health services.
      </Text>
    </View>
  );
};

export default MissionSubmitButton;
