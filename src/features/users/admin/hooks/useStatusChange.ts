import { useCallback, useState } from "react";

import { toast } from "@/components/feedback";
import { useLatestRef } from "@/hooks/useLatestRef";
import { toastError } from "@/utils/errorToast/toastError";

import type { StatusAction } from "../userAdmin.types";
import { statusToastMessage } from "../userStatusOverlay";

export type StatusBatch = { ids: string[]; names: string[]; action: StatusAction };

type Settled = { batch: StatusBatch; rows: unknown };

const statusFailedTitle = ({ ids, action }: StatusBatch): string => {
  const verb = action === "deactivate" ? "deactivated" : "reactivated";
  return ids.length === 1 ? `Account not ${verb}` : `Accounts not ${verb}`;
};

/**
 * Deactivate or reactivate straight away, then say so in the toast. The rows
 * change on screen while the request runs, and a saved change keeps applying
 * until the refetched `rows` replace the list, so changed rows never flicker back.
 */
export const useStatusChange = (commit: (batch: StatusBatch) => Promise<void>, rows: unknown) => {
  const [inFlight, setInFlight] = useState<StatusBatch[]>([]);
  const [settled, setSettled] = useState<Settled | null>(null);
  const rowsRef = useLatestRef(rows);

  const change = useCallback(
    async (batch: StatusBatch) => {
      setInFlight((current) => [...current, batch]);
      try {
        await commit(batch);
        // The rows still on screen; the refetch the commit started will replace them.
        setSettled({ batch, rows: rowsRef.current });
        toast.success(statusToastMessage(batch.names, batch.action));
      } catch (error: unknown) {
        toastError(statusFailedTitle(batch), error);
      } finally {
        setInFlight((current) => current.filter((item) => item !== batch));
      }
    },
    [commit, rowsRef]
  );

  const batches: StatusBatch[] = [...inFlight];
  if (settled && settled.rows === rows) batches.unshift(settled.batch);

  return { change, batches };
};
