import { useSyncExternalStore } from "react";

let params: Record<string, string> = {};
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
const snapshot = () => params;
export const useLocalSearchParams = () => useSyncExternalStore(subscribe, snapshot);
const router = { setParams: (next: Record<string, string>) => { params = { ...params, ...next }; listeners.forEach((fn) => fn()); } };
export const useRouter = () => router;
export const Platform = { OS: "web" };
let savedSearch = "";
export const getSavedSearch = () => savedSearch;
export const saveSearch = (_key: string, value: string) => { savedSearch = value; };
export const getSavedView = () => null;
export const saveView = () => {};
export const useAuth = () => ({ user: { role: "admin" } });
export const toast = { error: () => {}, success: () => {} };
export const toastBackgroundError = () => {};
export const clearImmunizationEditorRequest = () => {};
export const getImmunizationEditorRequest = () => null;
export const getChecklistRequestVersion = () => 0;
export const subscribeImmunizationSelection = () => () => {};
export const useRealtimeRefetch = () => {};
export const useUsersVersion = () => 0;
export const SEARCH_DEBOUNCE_MS = 10;
export const useMasterlistSummary = () => ({ summary: null, refresh: () => {} });
export const useServiceForms = () => ({ forms: [] });
export const useRecordDetail = () => ({ close: () => {}, open: () => {} });
const useRecordDeletion = () => ({});
export default useRecordDeletion;

// Invented fixtures. ID search deliberately ignores names like the server's
// resident clause; free-text search may return both namesakes.
const records = [
  { _id: "record-a", resident: { masterResidentId: "TEST-A", fullName: "Example Patient" } },
  { _id: "record-b", resident: { masterResidentId: "TEST-B", fullName: "Example Patient" } },
  { _id: "record-other", resident: { masterResidentId: "TEST-C", fullName: "Other Patient" } },
];
export const apiState = { fail: false, pending: null as Promise<void> | null, queries: [] as Record<string, string | number>[] };
export const lastQuery = () => apiState.queries.at(-1)!;
export const reset = () => { params = {}; savedSearch = ""; apiState.fail = false; apiState.pending = null; apiState.queries = []; };
export const searchMasterlist = async (query: Record<string, string | number>) => {
  apiState.queries.push(query);
  if (apiState.pending) await apiState.pending;
  if (apiState.fail) throw new Error("Fixture retrieval error");
  const matches = records.filter((r) => (!query.masterResidentId || r.resident.masterResidentId === query.masterResidentId)
    && (!query.search || r.resident.fullName.includes(String(query.search))));
  return { records: matches, total: matches.length, serviceCounts: null };
};
export const fetchMasterlistRecord = async () => null;
