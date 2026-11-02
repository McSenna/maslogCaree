import { useRef, useState } from "react";
import api from "@/services/api";
import { toast } from "@/components/feedback";
import { normalizeApiError } from "@/utils/apiErrorHandler";
import { useRemoteData } from "@/features/users/admin/hooks/useRemoteData";
import { invalidateUsers } from "@/features/users/admin/hooks/usersVersion";

const SOURCES = ["user"] as const;
export const useAccessResource = <T>(path: string) => {
  const remote = useRemoteData({
    key: path,
    load: async () => (await api.get<T>(path)).data,
    live: SOURCES,
  });
  const locked = useRef(false);
  const [saving, setSaving] = useState(false);
  const mutate = async (action: () => Promise<void>, success: string) => {
    if (locked.current || remote.isFetching || remote.isRefreshing) return;
    locked.current = true;
    setSaving(true);
    try {
      await action();
      invalidateUsers();
      toast.success(success);
    } catch (error: unknown) {
      toast.error(
        "Could not save the change",
        normalizeApiError(error).message,
      );
    } finally {
      // Reconcile even an ambiguous network failure or a conflicting revision.
      remote.refetch();
      locked.current = false;
      setSaving(false);
    }
  };
  return {
    ...remote,
    saving,
    busy: saving || remote.isFetching || remote.isRefreshing,
    mutate,
  };
};
