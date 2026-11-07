import { fetchRegularBookingOptions } from "@/services/appointments";
import { isAssignedTimeService, isRegularScheduleService } from "@/utils/serviceDays";

import { useRegularSchedule } from "../../regularSchedule/useRegularSchedule";
import { useWeeklyBookingDays } from "./useWeeklyBookingDays";

/**
 * The ways a service's date and time are chosen: the immunization day, and the
 * BP checking and prenatal calendar. A queued doctor service has no picker: the
 * queue assigns its time. Only the picker that fits the chosen service loads.
 */
export const useBookingPickers = () => {
  const weeklyDays = useWeeklyBookingDays();
  const regularPicker = useRegularSchedule(fetchRegularBookingOptions);

  return {
    weeklyDays,
    regularPicker,
    /** State only, so the form can call it while rendering a freshly opened modal. */
    resetAll: () => {
      weeklyDays.resetDays();
      regularPicker.reset();
    },
    loadFor: (serviceKey: string) => {
      weeklyDays.loadForService(isAssignedTimeService(serviceKey) ? serviceKey : null);
      regularPicker.activate(isRegularScheduleService(serviceKey) ? serviceKey : null);
    },
    discardAll: () => {
      weeklyDays.discardPending();
      regularPicker.discardPending();
    },
    /** A refused time means the list the resident saw is stale; reload the picker in use. */
    reloadFor: (serviceKey: string | null) => {
      if (isRegularScheduleService(serviceKey)) return regularPicker.reloadAfterRefusal();
      if (isAssignedTimeService(serviceKey)) return weeklyDays.reload();
    },
  };
};
