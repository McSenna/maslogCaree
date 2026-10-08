import type { ScreenView } from "../../hooks/useAnnouncementsScreen";
import { EmptyAnnouncements, LoadError, LoadingRows } from "../ui/ScreenStates";

type ListStateProps = {
  view: Exclude<ScreenView, "list">;
  onRetry: () => void;
  onCreate: () => void;
  onClearFilters: () => void;
};

/** The phone list's body in place of rows; the wide table draws the same states itself. */
const ListState = ({ view, onRetry, onCreate, onClearFilters }: ListStateProps) => {
  if (view === "loading") return <LoadingRows />;
  if (view === "error") return <LoadError onRetry={onRetry} />;
  return <EmptyAnnouncements filtered={view === "noResults"} onCreate={onCreate} onClear={onClearFilters} />;
};

export default ListState;
