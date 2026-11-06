import { Text, View } from "react-native";

import type { ThemeColors } from "@/theme/colors";
import { TYPE } from "@/theme/typography";

import { RESIDENT_STATUS_META } from "../residentDetailsModel";
import type { ResidentStatus } from "../residentDetails.types";

/** Dot plus word: the status reads the same in greyscale or to a screen reader. */
const ResidentStatusPill = ({ status, colors }: { status: ResidentStatus; colors: ThemeColors }) => {
  const meta = RESIDENT_STATUS_META[status];
  const tone = colors[meta.tone];

  return (
    <View
      accessible
      accessibilityLabel={`Status: ${meta.label}`}
      className="flex-row items-center gap-2 self-start rounded-lg px-3 py-1.5"
      style={{ backgroundColor: tone.bg }}
    >
      <View className="h-2 w-2 rounded-full" style={{ backgroundColor: tone.fg }} />
      <Text style={[TYPE.label, { color: tone.fg }]}>{meta.label}</Text>
    </View>
  );
};

export default ResidentStatusPill;
