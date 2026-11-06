import { useCallback, useEffect, useRef, useState } from "react";

import { onResync, subscribeToResource } from "@/lib/realtime/realtimeBus";
import { normalizeApiError } from "@/utils/apiErrorHandler";
import { toastBackgroundError } from "@/utils/errorToast/toastError";

import { fetchMasterResident } from "../services/masterListApi";
import type { ResidentDetailsState } from "./residentDetails.types";

/**
 * Loads one Master List record by id and keeps it current while the view is
 * open. State lives only in this hook, so closing the view drops the record:
 * nothing is cached for the next person at a shared health-centre screen.
 */
export const useResidentDetails = (id: string) => {
  const [state, setState] = useState<ResidentDetailsState>({ status: "loading" });
  // Newest request wins: a slow answer never overwrites a later one or a pushed update.
  const ticket = useRef(0);

  // Sets state only once the request settles. `quiet` is a background reload:
  // if it fails, the record already on screen stays and a toast says it may be behind.
  const load = useCallback(
    (quiet: boolean) => {
      const mine = ++ticket.current;
      return fetchMasterResident(id).then(
        (record) => {
          if (mine === ticket.current) setState({ status: "ready", record });
        },
        (caught: unknown) => {
          if (mine !== ticket.current) return;
          const { status, message } = normalizeApiError(caught);
          if (status === 404) return setState({ status: "notFound" });
          if (quiet) toastBackgroundError("Record not updated", caught);
          setState((previous) => (quiet && previous.status === "ready" ? previous : { status: "error", message }));
        }
      );
    },
    [id]
  );

  // The dialog is keyed by record id, so each record gets its own first load.
  useEffect(() => {
    void load(false);
    return () => {
      ticket.current += 1;
    };
  }, [load]);

  // Another admin's edit or delete shows up here without a reload.
  useEffect(
    () =>
      subscribeToResource("masterResident", (change) => {
        if (change.action === "resync") return void load(true);
        if (change.action === "deleted") {
          if (change.id !== id) return;
          ticket.current += 1;
          setState({ status: "notFound" });
          return;
        }
        if (change.record._id !== id) return;
        ticket.current += 1;
        setState({ status: "ready", record: change.record });
      }),
    [id, load]
  );

  // After a reconnect the push feed may have missed changes, so ask again quietly.
  useEffect(() => onResync(() => void load(true)), [load]);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    void load(false);
  }, [load]);

  return { state, retry };
};
