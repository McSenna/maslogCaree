import { useContext, useEffect, useRef, useState } from "react";
import { ClinicalSaveActivity } from "../components/ClinicalSaveBoundary";

/** Registers only changed input; saved records and untouched forms are not drafts. Returns whether this input changed. */
export const useClinicalDraft = (value: unknown) => {
  const activity = useContext(ClinicalSaveActivity);
  const snapshot = JSON.stringify(value);
  const [initial] = useState(snapshot);
  const id = useRef(Symbol("clinical-draft"));
  useEffect(() => {
    const key = id.current;
    activity?.draft(key, snapshot !== initial);
    return () => activity?.draft(key, false);
  }, [activity, initial, snapshot]);
  return snapshot !== initial;
};

export const useClinicalTransition = () => {
  const activity = useContext(ClinicalSaveActivity);
  return (action: () => void) => {
    if (activity) activity.transition(action);
    else action();
  };
};
