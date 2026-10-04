import { createContext, useContext } from "react";

/** The record's visit day (YYYY-MM-DD) for follow-up date limits; null means the visit is today. */
const VisitDayContext = createContext<string | null>(null);

export const VisitDayProvider = VisitDayContext.Provider;

export const useVisitDay = () => useContext(VisitDayContext);
