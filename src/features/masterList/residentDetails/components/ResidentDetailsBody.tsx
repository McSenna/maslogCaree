import { Text, View } from "react-native";

import type { ThemeColors } from "@/theme/colors";
import { TYPE } from "@/theme/typography";

import { residentFieldGroups } from "../residentDetailsModel";
import type { ResidentDetails, ResidentFieldGroup } from "../residentDetails.types";
import ResidentFieldList from "./ResidentFieldList";
import ResidentIdentityBanner from "./ResidentIdentityBanner";

type Props = { details: ResidentDetails; colors: ThemeColors; columns: boolean; compact: boolean };

const Group = ({ group, colors }: { group: ResidentFieldGroup; colors: ThemeColors }) => (
  <View className="gap-2">
    <Text accessibilityRole="header" aria-level={3} style={[TYPE.title, { color: colors.heading }]}>
      {group.title}
    </Text>
    <View style={{ borderTopWidth: 1, borderTopColor: colors.divider }}>
      <ResidentFieldList fields={group.fields} colors={colors} />
    </View>
  </View>
);

/**
 * The split information grid: personal information on the left, residency and
 * record history on the right. Below the desktop breakpoint the two columns
 * stack in the same reading order.
 */
const ResidentDetailsBody = ({ details, colors, columns, compact }: Props) => {
  const [personal, record, history] = residentFieldGroups(details);

  return (
    <View className="gap-6">
      <ResidentIdentityBanner details={details} colors={colors} compact={compact} />

      <View className={columns ? "flex-row items-start" : "gap-6"}>
        <View className={columns ? "min-w-0 flex-1 pr-6" : undefined}>
          <Group group={personal} colors={colors} />
        </View>
        {columns ? <View className="self-stretch" style={{ width: 1, backgroundColor: colors.divider }} /> : null}
        <View className={columns ? "min-w-0 flex-1 gap-6 pl-6" : "gap-6"}>
          <Group group={record} colors={colors} />
          <Group group={history} colors={colors} />
        </View>
      </View>
    </View>
  );
};

export default ResidentDetailsBody;
