import { useState } from "react";
import { useRemoteData } from "@/features/users/admin/hooks/useRemoteData";
import { requestProblem } from "../immunizationLogic";
import { immunizationApi } from "../services/immunizationApi";
import type { Baby, Checklist, Mother } from "../types";

/** The midwife's view of one mother's babies, and the checklist of the baby picked from them. */
const useChecklist = (mother: Mother) => {
  const [babyId, setBabyId] = useState<string | null>(null);
  const motherId = mother.masterResidentId;
  const key = `${motherId}:${babyId ?? ""}`;
  const result = useRemoteData({
    key,
    load: async () => {
      const { babies } = await immunizationApi.searchBabies(motherId);
      const checklist: Checklist | null =
        babyId && babies.some((baby: Baby) => baby._id === babyId)
          ? await immunizationApi.checklist(babyId, motherId)
          : null;
      return { key, babies, checklist };
    },
  });
  const current = result.data?.key === key ? result.data : null;
  const chooseBaby = (id: string) => setBabyId(id);
  const load = async () => {
    result.refetch();
  };
  return {
    babies: current?.babies ?? [],
    // A reload keeps the checklist on screen. Clearing it would unmount the grid
    // and any dose modal above it in the middle of a save.
    checklist: !result.error ? (current?.checklist ?? null) : null,
    loading: !result.error && !current,
    error: result.error ? requestProblem(result.error) : "",
    load,
    chooseBaby,
  };
};
export default useChecklist;
