import { subscribeToLogout } from "@/services/authEvents";
let appointmentId: string | null = null;
const listeners = new Set<() => void>();
const setImmunizationVisit = (id: string | null) => {
  appointmentId = id;
  listeners.forEach((listener) => listener());
};
const getImmunizationVisit = () => appointmentId;
const subscribeImmunizationVisit = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
subscribeToLogout(() => setImmunizationVisit(null));
export {
  setImmunizationVisit,
  getImmunizationVisit,
  subscribeImmunizationVisit,
};
