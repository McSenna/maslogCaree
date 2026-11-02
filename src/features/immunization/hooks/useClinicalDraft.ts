import { useContext, useEffect, useRef } from "react";
import { ClinicalSaveActivity } from "../components/ClinicalSaveBoundary";

/** Registers only changed input; saved records and untouched forms are not drafts. */
export const useClinicalDraft = (value: unknown) => {
  const activity = useContext(ClinicalSaveActivity);
  const snapshot = JSON.stringify(value);
  const initial = useRef(snapshot);
  const id = useRef(Symbol("clinical-draft"));
  useEffect(() => {
    const key = id.current;
    activity?.draft(key, snapshot !== initial.current);
    return () => activity?.draft(key, false);
  }, [activity, snapshot]);
};

export const useClinicalTransition = () => {
  const activity = useContext(ClinicalSaveActivity);
  return (action: () => void) => {
    if (activity) activity.transition(action);
    else action();
  };
};
