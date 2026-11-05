import { useAuth } from "@/contexts/AuthContext";
import ImmunizationRecordFields from "@/features/immunization/components/ImmunizationRecordFields";
import { useClinicalTransition } from "@/features/immunization/hooks/useClinicalDraft";
import { Text, View } from "react-native";

import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import { SectionCard } from "@/components/medicalRecord/complete/SectionCard";
import MedicalFieldInput from "@/components/medicalRecord/MedicalFieldInput";
import MedicalRecordForm from "@/components/medicalRecord/MedicalRecordForm";
import type { CompletionForm, MedicalField } from "@/services/medicalRecords";
import { PALETTE } from "@/theme/palette";

import type { RecordEditorState } from "../../hooks/useRecordEditor";
import { VISIT_FIELDS } from "../../recordEditorForm";
import ResidentPicker from "./ResidentPicker";
import ResidentSummary from "./ResidentSummary";
import VisitDateField from "./VisitDateField";

type Props = { editor: RecordEditorState; forms: CompletionForm[]; twoColumn: boolean; onOpenDate: () => void; busy?: boolean; onContentChange: () => void; onClinicalLayout: (y: number) => void };

const REASON_FIELD: MedicalField = {
  key: "reason",
  label: "Reason for change",
  type: "textarea",
  required: true,
  maxLength: 500,
  helper: "Kept with the record's history, for example: systolic copied wrong from the card.",
};

const SectionError = ({ message }: { message: string }) =>
  message ? (
    <Text accessibilityRole="alert" className="text-[14px] font-medium" style={{ color: PALETTE.red[600] }}>
      {message}
    </Text>
  ) : null;

/** The whole record on one page: who, when and what, then the service's own medical fields. */
const RecordEditorForm = ({ editor, forms, twoColumn, onOpenDate, busy, onContentChange, onClinicalLayout }: Props) => {
  const palette = useQueuePalette();
  const transition = useClinicalTransition();
  const { user } = useAuth();
  const immunization = !editor.isEditing && editor.serviceType === "immunization" && user?.role === "midwife";
  const visitValues: Record<string, string> = editor.visit;
  const serviceField: MedicalField = {
    key: "serviceType",
    label: "Service",
    type: "select",
    required: true,
    options: forms.filter((form) => form.categoryKey !== "immunization" || user?.role === "midwife").map((form) => ({ value: form.categoryKey, label: form.label })),
  };
  const otherVisitFields = VISIT_FIELDS.filter((field) => field.key !== "visitDate" && !(editor.isEditing && field.key === "source"));

  return (
    <View className="w-full gap-3.5">
      {!editor.isEditing ? <SectionCard icon="clipboard" title="Service">
        <MedicalFieldInput field={serviceField} value={editor.serviceType} error={editor.visitErrors.serviceType || undefined}
          disabled={busy} onChange={(value) => transition(() => editor.chooseService(typeof value === "string" ? value : ""))} />
      </SectionCard> : null}
      <SectionCard icon="user" title={immunization ? "Mother" : "Resident"} caption="From the barangay master list">
        {editor.resident ? (
          <ResidentSummary
            resident={editor.resident}
            confirmed={editor.confirmed}
            onConfirmedChange={editor.isEditing || busy ? undefined : value => transition(() => editor.setConfirmed(value))}
            onChange={editor.isEditing || busy ? undefined : () => transition(() => editor.chooseResident(null))}
          />
        ) : (
          <ResidentPicker onPick={editor.chooseResident} />
        )}
        <SectionError message={editor.residentError} />
      </SectionCard>

      {!immunization ? <>
      <SectionCard icon="calendar" title="Visit" caption="As written on the record">
        <VisitDateField value={editor.visit.visitDate} error={editor.visitErrors.visitDate || undefined} onOpen={onOpenDate} />

        {otherVisitFields.map((field) => (
          <MedicalFieldInput
            key={field.key}
            field={field}
            value={visitValues[field.key]}
            error={editor.visitErrors[field.key] || undefined}
            onChange={(value) => editor.setVisitField(field.key, value)}
          />
        ))}
      </SectionCard>

      <SectionCard icon="activity" title={editor.form ? `${editor.form.label} details` : "Medical details"} caption="Leave blank anything the record does not show">
        {editor.form ? (
          <MedicalRecordForm
            form={editor.form}
            values={editor.medical.values}
            errors={editor.medical.errors}
            onChange={editor.medical.onChange}
            twoColumn={twoColumn}
            visitDay={editor.visit.visitDate || null}
          />
        ) : (
          <Text className="text-[15px] leading-[21px]" style={{ color: palette.muted }}>
            Choose the service above to show its fields.
          </Text>
        )}
      </SectionCard>

      </> : editor.resident && editor.confirmed && editor.resident.masterResidentId ? (
        <View onLayout={event => onClinicalLayout(event.nativeEvent.layout.y + 16)}>
          <ImmunizationRecordFields key={editor.resident.masterResidentId} mother={{masterResidentId:editor.resident.masterResidentId,name:editor.resident.fullName}} busy={busy} onContentChange={onContentChange} />
        </View>
      ) : <Text className="text-[15px] leading-[21px]" style={{color:palette.muted}}>Select and confirm the mother above to show her babies and vaccine checklist.</Text>}

      {editor.isEditing && !immunization ? (
        <SectionCard icon="edit-3" title="Why are you changing this record?">
          <MedicalFieldInput field={REASON_FIELD} value={editor.reason} error={editor.reasonError || undefined} onChange={(value) => editor.setReason(typeof value === "string" ? value : "")} />
        </SectionCard>
      ) : null}
    </View>
  );
};

export default RecordEditorForm;
