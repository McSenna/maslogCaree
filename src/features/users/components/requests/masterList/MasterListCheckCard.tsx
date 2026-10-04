import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { DETAIL_RADIUS, useUserDetailsPalette } from "../../details/detailsTheme";
import type { MasterListReview, UserRequestResident } from "../../../services/userRequestTypes";
import { choosableCandidates } from "./linkChoice";
import LinkChoicePicker from "./LinkChoicePicker";
import { approvalLinkNote } from "./masterListComparison";
import { describeOutcome, REASON_LABELS, type MasterListTone } from "./masterListCopy";
import MasterRecordComparison from "./MasterRecordComparison";

type Props = {
  review?: MasterListReview | null;
  resident: UserRequestResident;
  isPending: boolean;
};

const useToneColors = (tone: MasterListTone) => {
  const palette = useUserDetailsPalette();
  if (tone === "match") return palette.statuses.approved;
  if (tone === "review") return palette.statuses.pending;
  return { text: palette.neutralText, bg: palette.neutralBg };
};

const NoteLine = ({ icon, text }: { icon: "link" | "alert-circle"; text: string }) => {
  const palette = useUserDetailsPalette();
  return (
    <View className="flex-row items-start gap-2">
      <View className="pt-0.5">
        <Feather name={icon} size={13} color={palette.muted} />
      </View>
      <Text className="min-w-0 flex-1 text-[13px]" style={{ color: palette.body }}>
        {text}
      </Text>
    </View>
  );
};

/** Admin-only summary of the master list check. Residents never see this. */
const MasterListCheckCard = ({ review, resident, isPending }: Props) => {
  const palette = useUserDetailsPalette();
  const summary = describeOutcome(review);
  const tone = useToneColors(summary.tone);
  const candidates = review?.candidates ?? [];
  const reasons = review?.reasons ?? [];
  const linkNote = approvalLinkNote(review, isPending);
  const linkedId = review?.linkedRecord?.masterResidentId;

  return (
    <View className="gap-3">
      <View
        className="flex-row items-start gap-3 p-3"
        style={{ borderRadius: DETAIL_RADIUS.card, backgroundColor: tone.bg }}
      >
        <View className="pt-px">
          <Feather name={summary.icon} size={18} color={tone.text} />
        </View>
        <View className="min-w-0 flex-1 gap-1">
          <Text className="text-[14px] font-bold" style={{ color: tone.text }}>
            {summary.title}
          </Text>
          <Text className="text-[13px] leading-[19px]" style={{ color: palette.body }}>
            {summary.body}
          </Text>
        </View>
      </View>

      {reasons.length > 0 || linkNote || linkedId ? (
        <View className="gap-2">
          {reasons.map((reason) => (
            <NoteLine key={reason} icon="alert-circle" text={REASON_LABELS[reason]} />
          ))}
          {linkNote ? <NoteLine icon="link" text={linkNote} /> : null}
          {linkedId ? (
            <NoteLine icon="link" text={`This account is linked to record ${linkedId}.`} />
          ) : null}
        </View>
      ) : null}

      {candidates.map((record) => (
        <MasterRecordComparison
          key={record.masterResidentId}
          resident={resident}
          record={record}
          reasons={candidates.length === 1 ? reasons : []}
        />
      ))}

      <LinkChoicePicker candidates={choosableCandidates(review, isPending)} />
    </View>
  );
};

export default MasterListCheckCard;
