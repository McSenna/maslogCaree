import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { QUEUE_RADIUS, useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import { spaceKeyActivates } from "@/utils/spaceKeyActivates";

import { formatCalendarDay } from "../../masterlistLabels";
import type { ResidentIdentity } from "../../types";

type Props = {
  identity: ResidentIdentity;
  selected: boolean;
  onSelect: (identity: ResidentIdentity) => void;
};

const capitalize = (value: string) => (value ? value[0].toUpperCase() + value.slice(1) : "");

/** Birth date, sex, purok and ID side by side, so two people with one name read differently. */
export const identityFacts = (identity: ResidentIdentity) =>
  [
    `Born ${formatCalendarDay(identity.dateOfBirth)}`,
    capitalize(identity.sex),
    identity.purok,
    identity.masterResidentId ?? "",
    identity.hasAccount ? "Has an account" : "No account yet",
  ]
    .filter(Boolean)
    .join(", ");

const IdentityOption = ({ identity, selected, onSelect }: Props) => {
  const palette = useQueuePalette();
  return (
    <Pressable
      onPress={() => onSelect(identity)}
      {...spaceKeyActivates(() => onSelect(identity))}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      aria-checked={selected}
      accessibilityLabel={`${identity.fullName}, ${identityFacts(identity)}`}
      className="w-full min-h-12 flex-row items-center gap-3 px-3.5 py-3 hover:opacity-90 active:opacity-80"
      style={{
        borderRadius: QUEUE_RADIUS.control,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? palette.primary : palette.panelBorder,
        backgroundColor: selected ? palette.primarySoft : palette.panelBg,
      }}
    >
      <Feather name={selected ? "check-circle" : "circle"} size={18} color={selected ? palette.primary : palette.subtle} />
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="text-[14px] font-semibold" style={{ color: palette.heading }}>
          {identity.fullName}
        </Text>
        <Text className="text-[12.5px] leading-[18px]" style={{ color: palette.muted }}>
          {identityFacts(identity)}
        </Text>
      </View>
    </Pressable>
  );
};

export default IdentityOption;
