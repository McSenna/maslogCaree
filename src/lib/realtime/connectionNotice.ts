// When losing the realtime connection is worth a toast. Free of React so it
// runs under `node --test`.

import type { ConnectionStatus } from "@/types/realtime";

/**
 * Calls `announce` once when the connection gives up and reads "offline", and
 * not again until it has come back (or was closed on purpose: sign-out, the
 * app moving to the background). Reconnect attempts in between stay quiet.
 */
export const createConnectionNotice = (announce: () => void) => {
  let announced = false;
  return (status: ConnectionStatus): void => {
    if (status === "connected" || status === "idle") {
      announced = false;
      return;
    }
    if (status !== "offline" || announced) return;
    announced = true;
    announce();
  };
};
