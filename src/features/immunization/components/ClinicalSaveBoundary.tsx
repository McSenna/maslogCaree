import {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import useClinicalNavigationGuard from "../hooks/useClinicalNavigationGuard";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

type SaveActivity = {
  begin: () => void;
  end: () => void;
  draft: (id: symbol, dirty: boolean) => void;
  transition: (action: () => void) => void;
};
export const ClinicalSaveActivity = createContext<SaveActivity | null>(null);

const ClinicalSaveBoundary = ({
  children,
  onBusyChange,
  onDraftChange,
}: {
  children: ReactNode;
  onBusyChange: (busy: boolean) => void;
  onDraftChange?: (dirty: boolean) => void;
}) => {
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const pending = useRef(0);
  const drafts = useRef(new Set<symbol>());
  const [discard, setDiscard] = useState<{ action: () => void } | null>(null);
  const draft = useCallback(
    (id: symbol, dirty: boolean) => {
      const before = drafts.current.size > 0;
      if (dirty) drafts.current.add(id);
      else drafts.current.delete(id);
      const hasDrafts = drafts.current.size > 0;
      if (before !== hasDrafts) {
        setDirty(hasDrafts);
        onDraftChange?.(hasDrafts);
      }
    },
    [onDraftChange],
  );
  const transition = useCallback((action: () => void) => {
    if (pending.current) return;
    if (drafts.current.size) setDiscard({ action });
    else action();
  }, []);
  const begin = useCallback(() => {
    pending.current += 1;
    setBusy(true);
    onBusyChange(true);
  }, [onBusyChange]);
  const end = useCallback(() => {
    pending.current = Math.max(0, pending.current - 1);
    setBusy(pending.current > 0);
    onBusyChange(pending.current > 0);
  }, [onBusyChange]);
  useClinicalNavigationGuard(dirty, busy, transition);
  const activity = useMemo(
    () => ({ begin, end, draft, transition }),
    [begin, end, draft, transition],
  );
  return (
    <ClinicalSaveActivity.Provider value={activity}>
      {children}
      <ConfirmationModal
        visible={discard !== null}
        title="Discard unsaved immunization details?"
        message="Saved vaccine records remain on file. The unsaved entry details will be discarded."
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        destructive
        onConfirm={() => {
          const action = discard?.action;
          setDiscard(null);
          action?.();
        }}
        onCancel={() => setDiscard(null)}
      />
    </ClinicalSaveActivity.Provider>
  );
};
export default ClinicalSaveBoundary;
