import { Text, View } from "react-native";

import ReasonList from "./ReasonList";
import RemarksField from "./RemarksField";
import type { RejectDraft } from "./useRejectDraft";

type RejectBodyProps = {
  draft: RejectDraft;
  isDark: boolean;
  textPrimary: string;
  textSecondary: string;
};

const RejectBody = ({ draft, isDark, textPrimary, textSecondary }: RejectBodyProps) => (
  <View>
    <Text className={`mb-2.5 text-[13px] font-medium ${textSecondary}`}>
      Select the primary reason for rejecting this verification request:
    </Text>

    <ReasonList
      selectedReason={draft.reason}
      onSelect={draft.selectReason}
      textPrimary={textPrimary}
    />

    <RemarksField
      remarks={draft.remarks}
      onChangeText={draft.changeRemarks}
      error={draft.error}
      required={draft.requiresRemarks}
      isDark={isDark}
      textPrimary={textPrimary}
    />
  </View>
);

export default RejectBody;
