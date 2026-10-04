import { useState } from "react";
import { Text, View } from "react-native";

import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import CompleteModalShell from "@/components/medicalRecord/complete/CompleteModalShell";
import { ErrorBanner, FooterButtons } from "@/components/medicalRecord/complete/CompletionChrome";
import { Block, Row } from "@/components/medicalRecord/details/RecordPrimitives";
import MedicalFieldInput from "@/components/medicalRecord/MedicalFieldInput";
import type { MasterResidentRecord } from "@/features/masterList/masterList.types";
import { formatBirthDate, masterFullName } from "@/features/masterList/masterResidentForm";
import type { AdminUser } from "@/features/users/services/userService";
import type { MedicalField } from "@/services/medicalRecords";

import { useMasterLinkAction, type MasterLinkMode } from "./useMasterLinkAction";
import MasterRecordPicker from "./MasterRecordPicker";

const REASON: MedicalField = { key: "reason", label: "Reason", type: "textarea", required: true, maxLength: 500, helper: "Kept in the system logs with this change." };

type Props = { user: AdminUser; mode: MasterLinkMode; onClose: () => void };

const COPY = {
  link: { title: "Link to a master list record", action: "Link account" },
  unlink: { title: "Unlink from the master list", action: "Unlink account" },
} as const;

/** Link or unlink one resident account. Mounted only while open, so it always starts empty. */
const MasterLinkDialog = ({ user, mode, onClose }: Props) => {
  const palette = useQueuePalette();
  const action = useMasterLinkAction({ userId: user._id, onDone: onClose });
  const [picked, setPicked] = useState<MasterResidentRecord | null>(null);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  const confirm = () => {
    if (!reason.trim()) return setReasonError("Say why this link is being changed.");
    if (mode === "link" && !picked) return undefined;
    void action.run(mode, reason, picked?.masterResidentId);
    return undefined;
  };

  return (
    <CompleteModalShell
      visible
      onRequestClose={onClose}
      dismissible={!action.saving}
      closeLabel="Close without changing the link"
      title={COPY[mode].title}
      subtitle={user.fullname}
      footer={
        <FooterButtons backLabel="Cancel" onBack={onClose} nextLabel={action.saving ? "Saving..." : COPY[mode].action} onNext={confirm} busy={action.saving} disabled={mode === "link" && !picked} />
      }
    >
      {action.error ? <ErrorBanner message={action.error} /> : null}
      {mode === "unlink" ? (
        <Text className="text-[13px] leading-[19px]" style={{ color: palette.body }}>
          {`Records filed under ${user.masterResidentId ?? "this record"} stay on file and stop showing in this account. Link it again to restore them.`}
        </Text>
      ) : (
        <MasterRecordPicker picked={picked} onPick={setPicked} />
      )}
      {mode === "link" && picked ? (
        <Block title="Check this is the same person" palette={palette}>
          <Row label="Account" value={`${user.fullname}, born ${formatBirthDate(String(user.dateOfBirth).slice(0, 10))}`} palette={palette} />
          <Row label="Master list" value={`${masterFullName(picked)}, born ${formatBirthDate(picked.dateOfBirth)}`} palette={palette} />
        </Block>
      ) : null}
      <View>
        <MedicalFieldInput
          field={REASON}
          value={reason}
          error={reasonError || undefined}
          onChange={(value) => {
            setReason(typeof value === "string" ? value : "");
            setReasonError("");
          }}
        />
      </View>
    </CompleteModalShell>
  );
};

export default MasterLinkDialog;
