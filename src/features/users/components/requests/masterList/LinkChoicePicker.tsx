import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { spaceKeyActivates } from "@/utils/spaceKeyActivates";

import { DETAIL_RADIUS, useUserDetailsPalette } from "../../details/detailsTheme";
import type { MasterResidentRecord } from "../../../services/userRequestTypes";
import { useLinkChoice } from "./LinkChoiceContext";

const Option = ({ selected, label, detail, onPress }: { selected: boolean; label: string; detail: string; onPress: () => void }) => {
  const palette = useUserDetailsPalette();
  return (
    <Pressable
      onPress={onPress}
      {...spaceKeyActivates(onPress)}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      aria-checked={selected}
      accessibilityLabel={`${label}. ${detail}`}
      className="min-h-12 flex-row items-start gap-2.5 px-3 py-2.5 hover:opacity-90 active:opacity-80"
      style={{
        borderRadius: DETAIL_RADIUS.card,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? palette.primary : palette.cardBorder,
      }}
    >
      <View className="pt-0.5">
        <Feather name={selected ? "check-circle" : "circle"} size={16} color={selected ? palette.primary : palette.muted} />
      </View>
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="text-[13.5px] font-semibold" style={{ color: palette.heading }}>
          {label}
        </Text>
        <Text className="text-[12.5px] leading-[18px]" style={{ color: palette.body }}>
          {detail}
        </Text>
      </View>
    </Pressable>
  );
};

/**
 * Lets the admin say which master list record this person is, or keep the
 * account unlinked (the default). The link decides whose medical records the
 * resident sees, so nothing is picked for them.
 */
const LinkChoicePicker = ({ candidates }: { candidates: MasterResidentRecord[] }) => {
  const palette = useUserDetailsPalette();
  const state = useLinkChoice();
  if (!state || candidates.length === 0) return null;
  const { choice, setChoice } = state;

  return (
    <View className="gap-2" accessibilityRole="radiogroup">
      <Text className="text-[13px] font-semibold" style={{ color: palette.heading }}>
        Link this account to a master list record?
      </Text>
      <Option
        selected={typeof choice !== "string"}
        label="Keep unlinked"
        detail="Approve without a link. You can link the account later from its profile."
        onPress={() => setChoice(null)}
      />
      {candidates.map((record) => (
        <Option
          key={record.masterResidentId}
          selected={choice === record.masterResidentId}
          label={`Link to record ${record.masterResidentId}`}
          detail="Only if the comparison above shows this is the same person. Their medical records will show in this account."
          onPress={() => setChoice(record.masterResidentId)}
        />
      ))}
    </View>
  );
};

export default LinkChoicePicker;
