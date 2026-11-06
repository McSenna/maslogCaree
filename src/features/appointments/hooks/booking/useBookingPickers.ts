import { fetchRegularBookingOptions } from "@/services/appointments";
import { isAssignedTimeService, isRegularScheduleService, isWeeklyService } from "@/utils/serviceDays";

import { useRegularSchedule } from "../../regularSchedule/useRegularSchedule";
import { useBookingSlots } from "./useBookingSlots";
import { useWeeklyBookingDays } from "./useWeeklyBookingDays";

/**
 * The three ways a service's date and time are chosen: mission slots, the
 * immunization day, and BP checking's own calendar. Only the one that fits the
 * chosen service loads; the others are emptied.
 */
export const useBookingPickers = () => {
  const slots = useBookingSlots();
  const weeklyDays = useWeeklyBookingDays();
  const regularPicker = useRegularSchedule(fetchRegularBookingOptions);

  return {
    slots,
    weeklyDays,
    regularPicker,
    /** State only, so the form can call it while rendering a freshly opened modal. */
    resetAll: () => {
      slots.resetSlots();
      weeklyDays.resetDays();
      regularPicker.reset();
    },
    loadFor: (serviceKey: string) => {
      weeklyDays.loadForService(isAssignedTimeService(serviceKey) ? serviceKey : null);
      regularPicker.activate(isRegularScheduleService(serviceKey) ? serviceKey : null);
      slots.loadForService(isWeeklyService(serviceKey) ? null : serviceKey);
    },
    discardAll: () => {
      slots.discardPending();
      weeklyDays.discardPending();
      regularPicker.discardPending();
    },
    /** A refused time means the list the resident saw is stale; reload the picker in use. */
    reloadFor: (serviceKey: string | null) => {
      if (isRegularScheduleService(serviceKey)) return regularPicker.reloadAfterRefusal();
      if (isAssignedTimeService(serviceKey)) return weeklyDays.reload();
      return slots.reloadAfterRefusal();
    },
  };
};
