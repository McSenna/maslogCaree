import { useContext, useRef, useState } from "react";
import { ClinicalSaveActivity } from "../components/ClinicalSaveBoundary";
import { requestProblem } from "../immunizationLogic";

const useClinicalSave = () => {
  const activity = useContext(ClinicalSaveActivity);
  const lock = useRef(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const save = async (
    action: () => Promise<unknown>,
    onSaved: () => void | Promise<void>,
  ) => {
    if (lock.current) return;
    lock.current = true;
    activity?.begin();
    setSaving(true);
    setError("");
    try {
      await action();
      await onSaved();
    } catch (problem) {
      setError(requestProblem(problem));
    } finally {
      activity?.end();
      lock.current = false;
      setSaving(false);
    }
  };
  return { save, saving, error, setError };
};
export default useClinicalSave;
