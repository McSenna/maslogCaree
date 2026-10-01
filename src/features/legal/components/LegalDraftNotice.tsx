import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import type { ThemeColors } from "@/theme/colors";
import { TYPE } from "@/theme/typography";

import { LEGAL_DRAFT_NOTICE } from "../content";

/**
 * A standing note, not an alert: it is part of the page, so it is read in
 * order instead of interrupting the screen reader every time a document opens.
 */
const LegalDraftNotice = ({ colors }: { colors: ThemeColors }) => (
  <View
    role="note"
    className="flex-row items-start gap-3 rounded-md border p-4"
    style={{ borderColor: colors.warning.border, backgroundColor: colors.warning.bg }}
  >
    <View aria-hidden className="pt-0.5">
      <Feather name="alert-triangle" size={16} color={colors.warning.fg} />
    </View>
    <Text className="min-w-0 flex-1" style={[TYPE.body, { color: colors.warning.fg }]}>
      <Text style={TYPE.bodyStrong}>{LEGAL_DRAFT_NOTICE.lead}</Text> {LEGAL_DRAFT_NOTICE.body}
    </Text>
  </View>
);

export default LegalDraftNotice;
