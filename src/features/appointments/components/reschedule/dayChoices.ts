/** One pickable day: a mission date, or a Thursday on the immunization schedule. */
export type DayChoice = { id: string; date: string; openCount: number };

export const missionDayChoices = (
  schedules: { missionScheduleId: string; date: string; availableSlotStarts: string[] }[]
): DayChoice[] =>
  schedules.map((schedule) => ({ id: schedule.missionScheduleId, date: schedule.date, openCount: schedule.availableSlotStarts.length }));

export const weeklyDayChoices = (days: { dateKey: string; date: string; openPositions: number }[]): DayChoice[] =>
  days.map((day) => ({ id: day.dateKey, date: day.date, openCount: day.openPositions }));
