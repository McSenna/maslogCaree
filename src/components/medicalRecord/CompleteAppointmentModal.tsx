import { useState } from "react";

import type { AppointmentRecord } from "@/services/appointments";
import type { CompletionForm } from "@/services/medicalRecords";

import { useMedicalRecordForm } from "./MedicalRecordForm";
import { useDispensedItems } from "./dispensing/useDispensedItems";
import CompleteModalShell, { PANEL_TWO_COLUMN_WIDTH } from "./complete/CompleteModalShell";
import CompletionBody from "./complete/CompletionBody";
import { ErrorBanner } from "./complete/CompletionChrome";
import CompletionSuccess from "./complete/CompletionSuccess";
import { buildCompletionFooter } from "./complete/hooks/completionFooter";
import { useCompletionFlow } from "./complete/hooks/useCompletionFlow";
import { buildVaccineFieldOverride } from "./complete/hooks/vaccineFieldOverride";
import type { CompletionResult } from "./complete/completionTypes";
import { patientFactsOf } from "./complete/patientFacts";
import { useVaccineLink } from "./complete/useVaccineLink";

export type { CompletionResult } from "./complete/completionTypes";

const CompleteAppointmentModal = ({
  visible,
  appointment,
  form,
  formError,
  serviceLabel,
  providerName,
  onClose,
  onCompleted,
  onViewRecord,
}: {
  visible: boolean;
  appointment: AppointmentRecord | null;
  form: CompletionForm | null;
  formError?: string | null;
  serviceLabel: string;
  providerName?: string | null;
  onClose: () => void;
  onCompleted: (result: CompletionResult) => void;
  onViewRecord?: (appointment: AppointmentRecord) => void;
}) => {
  const medicalForm = useMedicalRecordForm(form);
  const { values, errors, onChange } = medicalForm;
  const dispensed = useDispensedItems();
  const vaccine = useVaccineLink({
    form,
    lines: dispensed.lines,
    onChange,
    addLine: dispensed.add,
    removeLine: dispensed.remove,
  });

  const [panelWidth, setPanelWidth] = useState(0);

  const { step, setStep, saving, submitError, result, handleReview, handleConfirm } =
    useCompletionFlow({
      visible,
      appointment,
      form,
      medicalForm,
      dispensed,
      vaccineReset: vaccine.reset,
      onCompleted,
    });

  if (!appointment) return null;

  const patient = patientFactsOf(appointment);
  const twoColumn = panelWidth >= PANEL_TWO_COLUMN_WIDTH;

  const fieldOverrides = buildVaccineFieldOverride({ vaccine, values, errors, saving });

  const footer = buildCompletionFooter({
    step,
    saving,
    hasForm: Boolean(form),
    onClose,
    onReview: handleReview,
    onBackToForm: () => setStep("form"),
    onConfirm: () => void handleConfirm(),
  });

  return (
    <CompleteModalShell
      visible={visible}
      onRequestClose={onClose}
      dismissible={!saving}
      onLayoutWidth={setPanelWidth}
      title={step === "success" ? "Appointment completed" : "Complete Appointment"}
      subtitle={step === "success" ? undefined : `${patient.name} · ${serviceLabel}`}
      footer={footer}
    >
      {step === "success" && result ? (
        <CompletionSuccess
          patientName={patient.name}
          serviceLabel={serviceLabel}
          movements={result.inventoryTransactions}
          canViewRecord={Boolean(onViewRecord && result.appointment?.medicalRecord)}
          onViewRecord={() => {
            onClose();
            if (result.appointment) onViewRecord?.(result.appointment);
          }}
          onClose={onClose}
        />
      ) : (
        <>
          {submitError ? <ErrorBanner message={submitError} /> : null}
          <CompletionBody
            step={step === "review" ? "review" : "form"}
            appointment={appointment}
            form={form}
            formError={formError}
            serviceLabel={serviceLabel}
            providerName={providerName}
            values={values}
            errors={errors}
            onChange={onChange}
            saving={saving}
            twoColumn={twoColumn}
            fieldOverrides={fieldOverrides}
            dispensed={dispensed}
          />
        </>
      )}
    </CompleteModalShell>
  );
};

export default CompleteAppointmentModal;
