import { useCallback, useState } from "react";

import { useUndoableAction } from "@/hooks/useUndoableAction";

import type { StatusAction } from "../userAdmin.types";
import { statusToastMessage } from "../userStatusOverlay";

export type StatusBatch = { ids: string[]; names: string[]; action: StatusAction };

type Settled = { batch: StatusBatch; rows: unknown };

const statusFailedTitle = ({ ids, action }: StatusBatch): string => {
  const verb = action === "deactivate" ? "deactivated" : "reactivated";
  return ids.length === 1 ? `Account not ${verb}` : `Accounts not ${verb}`;
};

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
  const undoable = useUndoableAction(commitAndHold, statusFailedTitle);
  const { pending, toast } = undoable;

  const batches: StatusBatch[] = [];
  if (settled && settled.rows === rows) batches.push(settled.batch);
  if (pending) batches.push(pending);

  const message = toast ? statusToastMessage(toast.item.names, toast.item.action) : null;

  return { ...undoable, batches, message };
};
