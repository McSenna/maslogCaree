import { useMemo } from "react";

import { useRemoteData } from "@/features/users/admin/hooks/useRemoteData";
import { fetchCompletionForms, type CompletionForm } from "@/services/medicalRecords";

import { relaxForEncoding } from "../recordEditorForm";

/** The per-service record forms, limited to the services this role may encode. */
export const useServiceForms = (ownedServices: readonly string[]) => {
  const result = useRemoteData({ key: "medical-masterlist:forms", load: fetchCompletionForms });

  const forms = useMemo<CompletionForm[]>(
    () => (result.data ?? []).filter((form) => ownedServices.includes(form.categoryKey)).map(relaxForEncoding),
    [result.data, ownedServices]
  );

  return { forms, loading: result.isLoading, error: result.error, retry: result.refetch };
};
