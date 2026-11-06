import { Text, View } from "react-native";

import type { ThemeColors } from "@/theme/colors";
import { withAlpha } from "@/theme/palette";
import { TYPE } from "@/theme/typography";

import { masterRoleLabel } from "../../masterResidentRoles";
import { residentDisplayName, residentInitials } from "../residentDetailsModel";
import type { ResidentDetails } from "../residentDetails.types";
import ResidentStatusPill from "./ResidentStatusPill";

const AVATAR = 52;
const COMPACT_AVATAR = 40;

type Props = {
  details: ResidentDetails;
  colors: ThemeColors;
  /** Phones: a smaller avatar and no divider, so a long name keeps the width. */
  compact?: boolean;
};

/** Who this record is about, at a glance: initials, full name, record ID and role, status. */
const ResidentIdentityBanner = ({ details, colors, compact = false }: Props) => {
  const avatar = compact ? COMPACT_AVATAR : AVATAR;

  return (
    <View
      className={`flex-row rounded-2xl p-4 ${compact ? "items-start gap-3" : "items-center gap-4"}`}
      style={{ backgroundColor: colors.primarySoft }}
    >
      <View
        aria-hidden
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className="items-center justify-center rounded-full"
        style={{ width: avatar, height: avatar, backgroundColor: withAlpha(colors.primary, 0.12) }}
      >
        <Text style={[compact ? TYPE.label : TYPE.title, { color: colors.primary }]}>{residentInitials(details)}</Text>
      </View>

      {compact ? null : (
        <View className="self-stretch" style={{ width: 2, borderRadius: 1, backgroundColor: withAlpha(colors.primary, 0.35) }} />
      )}

      <View className="min-w-0 flex-1 flex-row flex-wrap items-center gap-x-5 gap-y-2">
        <View className="min-w-0 shrink">
          <Text style={[compact ? TYPE.title : TYPE.headline, { color: colors.heading }]}>{residentDisplayName(details)}</Text>
          <Text style={[TYPE.body, { color: colors.body }]}>
            {details.recordId}
            {"  ·  "}
            {masterRoleLabel(details.role)}
          </Text>
        </View>
        <ResidentStatusPill status={details.status} colors={colors} />
      </View>
    </View>
  );
};

export default ResidentIdentityBanner;
