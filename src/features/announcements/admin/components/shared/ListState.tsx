import type { ScreenView } from "../../hooks/useAnnouncementsScreen";
import { LoadError, LoadingRows, NoAnnouncements, NoResults } from "../ui/ScreenStates";

type ListStateProps = {
  view: Exclude<ScreenView, "list">;
  onRetry: () => void;
  onCreate: () => void;
  onClearFilters: () => void;
};

/** The body shown in place of rows: loading, error, nothing yet, or nothing matching. */
const ListState = ({ view, onRetry, onCreate, onClearFilters }: ListStateProps) => {
  if (view === "loading") return <LoadingRows />;
  if (view === "error") return <LoadError onRetry={onRetry} />;
  if (view === "empty") return <NoAnnouncements onCreate={onCreate} />;
  return <NoResults onClear={onClearFilters} />;
};

export default ListState;
