import { View } from "react-native";
import type { AppointmentRecord } from "@/services/appointments";
import type { CompletionForm, MedicalField } from "@/services/medicalRecords";
import MedicalRecordForm, { type FormValues } from "../MedicalRecordForm";
import type { FieldValue } from "../MedicalFieldInput";
import DispensedItemsSection from "../dispensing/DispensedItemsSection";
import type { DispensedLine } from "../dispensing/useDispensedItems";
import type { InventoryItem } from "@/features/inventory/services/inventoryService";
import { SectionCard } from "./CompleteModalShell";
import { CompletionPlaceholder } from "./CompletionChrome";
import CompletionReview from "./CompletionReview";
import { AppointmentSummaryCard, PatientSummaryCard } from "./SummaryCards";

const CompletionBody = ({
  step,
  appointment,
  form,
  formError,
  serviceLabel,
  providerName,
  values,
  errors,
  onChange,
  saving,
  twoColumn,
  fieldOverrides,
  dispensed,
}: {
  step: "form" | "review";
  appointment: AppointmentRecord;
  form: CompletionForm | null;
  formError?: string | null;
  serviceLabel: string;
  providerName?: string | null;
  values: FormValues;
  errors: Record<string, string>;
  onChange: (key: string, value: FieldValue) => void;
  saving: boolean;
  twoColumn: boolean;
  fieldOverrides?: Record<string, (field: MedicalField) => React.ReactNode>;
  dispensed: {
    lines: DispensedLine[];
    selectedIds: Set<string>;
    add: (item: InventoryItem) => void;
    setQuantity: (itemId: string, quantity: number) => void;
    remove: (itemId: string) => void;
  };
}) => {
  return (
    <>
      <View className={twoColumn ? "w-full flex-row gap-3" : "w-full gap-3"}>
        <View className="min-w-0 flex-1">
          <PatientSummaryCard appointment={appointment} />
        </View>
        <View className="min-w-0 flex-1">
          <AppointmentSummaryCard
            appointment={appointment}
            serviceLabel={serviceLabel}
            providerName={providerName}
          />
        </View>
      </View>

      {formError ? (
        <CompletionPlaceholder error message={formError} />
      ) : !form ? (
        <CompletionPlaceholder message="Loading the form for this service…" />
      ) : step === "review" ? (
        <SectionCard icon="check-square" title="Review" caption="Confirm this before it is filed.">
          <CompletionReview
            form={form}
            values={values}
            lines={dispensed.lines}
            serviceLabel={serviceLabel}
          />
        </SectionCard>
      ) : (
        <>
          <SectionCard icon="clipboard" title="Medical Record" caption={`Recorded for ${form.label} visits.`}>
            <MedicalRecordForm
              form={form}
              values={values}
              errors={errors}
              onChange={onChange}
              disabled={saving}
              twoColumn={twoColumn}
              fieldOverrides={fieldOverrides}
            />
          </SectionCard>

          <SectionCard
            icon="package"
            title="Medicines / Supplies Given"
            caption="Optional — deducted from inventory on completion."
          >
            <DispensedItemsSection
              lines={dispensed.lines}
              selectedIds={dispensed.selectedIds}
              onAdd={dispensed.add}
              onChangeQuantity={dispensed.setQuantity}
              onRemove={dispensed.remove}
              disabled={saving}
            />
          </SectionCard>
        </>
      )}
    </>
  );
};

export default CompletionBody;
