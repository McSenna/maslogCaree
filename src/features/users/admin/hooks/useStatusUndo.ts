import { useCallback, useState } from "react";

import { useUndoableAction } from "@/hooks/useUndoableAction";

import type { StatusAction } from "../userAdmin.types";
import { statusToastMessage } from "../userStatusOverlay";

export type StatusBatch = { ids: string[]; names: string[]; action: StatusAction };

type Settled = { batch: StatusBatch; rows: unknown };

/**
 * Deactivate or reactivate with undo, on the shared undoable action. The one
 * users-only rule: a committed change keeps applying until the refetched
 * `rows` replace the list on screen, so changed rows never flicker back.
 */
export const useStatusUndo = (commit: (batch: StatusBatch) => Promise<void>, rows: unknown) => {
  const [settled, setSettled] = useState<Settled | null>(null);

  const commitAndHold = useCallback(
    async (batch: StatusBatch) => {
      await commit(batch);
      setSettled({ batch, rows });
    },
    [commit, rows]
  );
  const undoable = useUndoableAction(commitAndHold);
  const { pending, toast } = undoable;

  const batches: StatusBatch[] = [];
  if (settled && settled.rows === rows) batches.push(settled.batch);
  if (pending) batches.push(pending);

  const message =
    toast?.kind === "pending" ? statusToastMessage(toast.item.names, toast.item.action) : toast ? "Could not update. Try again." : null;

  return { ...undoable, batches, message };
};
