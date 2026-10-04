import { useRemoteData } from "@/features/users/admin/hooks/useRemoteData";

import { fetchMasterlistSummary } from "../services/masterlistRecordsApi";

const SUMMARY_SOURCES = ["medicalRecord"] as const;

/** Counts for the summary cards; `refresh` runs after every save, and any record change reloads them. */
export const useMasterlistSummary = () => {
  const result = useRemoteData({ key: "medical-masterlist:summary", load: fetchMasterlistSummary, live: SUMMARY_SOURCES });
  return { summary: result.data, error: result.error, refresh: result.refetch };
};
