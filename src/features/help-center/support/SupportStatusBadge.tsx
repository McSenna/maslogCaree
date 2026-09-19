import { Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";

import { supportStatusLabel } from "../utils/support.utils";
import type { SupportStatus } from "../types/support.types";

type SupportStatusBadgeProps = {
  status: SupportStatus;
};

const SupportStatusBadge = ({ status }: SupportStatusBadgeProps) => {
  const palette = useResidentDialogPalette();

  const tone = {
    open: { bg: palette.accentSoft, fg: palette.accent, border: palette.accentBorder },
    in_review: { bg: palette.warningSoft, fg: palette.warningFg, border: palette.warning },
    awaiting_user: { bg: palette.dangerSoft, fg: palette.dangerFg, border: palette.dangerBorder },
    resolved: { bg: palette.successSoft, fg: palette.successFg, border: palette.successBorder },
    closed: { bg: palette.card, fg: palette.muted, border: palette.border },
  }[status];

  return (
    <View
      accessibilityLabel={`Status: ${supportStatusLabel(status)}`}
      style={{
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: RADIUS.pill,
        backgroundColor: tone.bg,
        borderWidth: 1,
        borderColor: tone.border,
      }}
    >
      <Text style={{ fontSize: 11.5, fontWeight: "700", color: tone.fg }}>
        {supportStatusLabel(status)}
      </Text>
    </View>
  );
};

export default SupportStatusBadge;
