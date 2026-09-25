import { Fragment, useSyncExternalStore, type ReactNode } from "react";

const subscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

/**
 * The static web export pre-renders every route at a zero-width window with no
 * signed-in user. React keeps the server's inline styles when hydration
 * mismatches, so width-driven layouts (the desktop sidebar, grids, dialogs)
 * would stay in their pre-rendered shape until the next resize. Hydration reads
 * the server snapshot, then React re-renders with the client one; the key change
 * remounts the UI with the real window and session. Native never hydrates, so it
 * always renders the client pass. Providers above this boundary keep their state.
 */
const HydrationBoundary = ({ children }: { children: ReactNode }) => {
  const isClient = useSyncExternalStore(subscribe, onClient, onServer);
  return <Fragment key={isClient ? "client" : "server"}>{children}</Fragment>;
};

export default HydrationBoundary;
