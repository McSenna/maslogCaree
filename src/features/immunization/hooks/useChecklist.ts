import { useState } from "react";
import { useRemoteData } from "@/features/users/admin/hooks/useRemoteData";
import { useSyncOnChange } from "@/hooks/useSyncOnChange";
import { requestProblem } from "../immunizationLogic";
import { immunizationApi } from "../services/immunizationApi";
import type { Baby, Checklist, Mother } from "../types";

const useChecklist = (
  isMidwife: boolean,
  notificationBaby: string | null,
  selectedMother?: Mother | null,
) => {
  const [pickedMother, setMother] = useState<Mother | null>(null);
  const [babyId, setBabyId] = useState<string | null>(notificationBaby);
  useSyncOnChange([notificationBaby], () => {
    if (!isMidwife && notificationBaby) setBabyId(notificationBaby);
  });
  const mother = selectedMother === undefined ? pickedMother : selectedMother;
  const motherId = mother?.masterResidentId;
  const key = `${isMidwife ? "midwife" : "resident"}:${motherId ?? ""}:${babyId ?? ""}`;
  const result = useRemoteData({
    key,
    load: async () => {
      let babies: Baby[] = [];
      let checklist: Checklist | null = null;
      if (!isMidwife || motherId) {
        babies = (await immunizationApi.searchBabies(motherId)).babies;
        if (babyId && babies.some((baby) => baby._id === babyId))
          checklist = await immunizationApi.checklist(babyId, motherId);
      }
      return { key, babies, checklist };
    },
  });
  const current = result.data?.key === key ? result.data : null;
  const chooseMother = (next: Mother) => {
    setBabyId(null);
    setMother(next);
  };
  const chooseBaby = (id: string) => setBabyId(id);
  const load = async () => {
    result.refetch();
  };
  return {
    mother,
    babies: current?.babies ?? [],
    babyId,
    checklist:
      !result.isFetching && !result.error ? (current?.checklist ?? null) : null,
    loading: !result.error && (result.isFetching || !current),
    error: result.error ? requestProblem(result.error) : "",
    load,
    chooseMother,
    chooseBaby,
  };
};
export default useChecklist;
