import { useCallback, useMemo, useState } from "react";
import type { CompletionForm, MedicalField } from "@/services/medicalRecords";
import type { FieldValue } from "../MedicalFieldInput";
import type { DispensedLine } from "../dispensing/useDispensedItems";
import type { VaccinePick } from "./VaccineField";

export const findInventoryField = (form: CompletionForm | null): MedicalField | null => {
  return form?.service.find((field) => Boolean(field.inventoryCategory)) ?? null;
};

export const useVaccineLink = ({
  form,
  lines,
  onChange,
  addLine,
  removeLine,
}: {
  form: CompletionForm | null;
  lines: DispensedLine[];
  onChange: (key: string, value: FieldValue) => void;
  addLine: (item: VaccinePick["item"], quantity?: number) => void;
  removeLine: (itemId: string) => void;
}) => {
  const [linkedId, setLinkedId] = useState<string | null>(null);

  const field = useMemo(() => findInventoryField(form), [form]);

  const linkedItem = useMemo(
    () => (linkedId ? (lines.find((line) => line.item._id === linkedId)?.item ?? null) : null),
    [linkedId, lines]
  );

  const has = useCallback(
    (key: string) => Boolean(form?.service.some((f) => f.key === key)),
    [form]
  );

  const pick = useCallback(
    (next: VaccinePick) => {
      if (!field) return;

      if (linkedId && linkedId !== next.item._id) removeLine(linkedId);

      onChange(field.key, next.vaccineName);
      if (has("batchNumber")) onChange("batchNumber", next.batchNumber);
      if (has("expiryDate")) onChange("expiryDate", next.expiryDate);

      addLine(next.item, 1);
      setLinkedId(next.item._id);
    },
    [field, linkedId, onChange, has, addLine, removeLine]
  );

  const unlink = useCallback(() => {
    if (linkedId) removeLine(linkedId);
    setLinkedId(null);
  }, [linkedId, removeLine]);

  const reset = useCallback(() => setLinkedId(null), []);

  return { field, linkedItem, pick, unlink, reset };
};
