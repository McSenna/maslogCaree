import { useCallback, useState } from "react";

/** What the resident types or ticks on the Details step, apart from the service and the time. */
export const useBookingFields = () => {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [childName, setChildName] = useState("");
  const [childDob, setChildDob] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  /** State only, so the form can call it while rendering a freshly opened modal. */
  const resetFields = useCallback(() => {
    setReason("");
    setNotes("");
    setChildName("");
    setChildDob("");
    setConfirmed(false);
  }, []);

  return {
    reason,
    setReason,
    notes,
    setNotes,
    childName,
    setChildName,
    childDob,
    setChildDob,
    confirmed,
    toggleConfirmed: () => setConfirmed((previous) => !previous),
    resetFields,
  };
};
