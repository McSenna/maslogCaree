import type { Dose, ImmunizationRecord } from "./types.ts";

const pending = (slot: Dose["slot"], label: string): Dose => ({ slot, label, status: "pending" });

/**
 * Test data only, imported by the demo and the tests. No name or ID here belongs
 * to a resident. Lengths are close to real values so the layout is tested fairly.
 */
export const MOCK_RECORD: ImmunizationRecord = {
  recordId: "REC-TEST0001",
  baby: {
    name: "Test Baby Sample",
    dob: "2026-08-01",
    id: "test0000aaaabbbbcccc0001",
    isSampleName: true,
  },
  mother: {
    name: "Test Mother Fixture Sample",
    dob: "1990-01-01",
    sex: "Female",
    purok: "Purok 0",
    masterListId: "MSL-TEST0001",
    hasLinkedAccount: false,
  },
  visit: {
    date: "2026-09-13",
    provider: "Test Midwife",
    type: "Immunization",
    source: "Manual entry",
  },
  vaccines: [
    { id: "bcg", name: "BCG", doses: [{ slot: "birth", label: "Dose 1", status: "completed", administeredOn: "2026-09-13" }] },
    { id: "hepb", name: "Hepatitis B", doses: [{ slot: "birth", label: "Birth dose", status: "completed", administeredOn: "2026-09-13" }] },
    { id: "penta", name: "Pentavalent (DPT-HepB-Hib)", doses: [pending("6w", "Dose 1"), pending("10w", "Dose 2"), pending("14w", "Dose 3")] },
    { id: "opv", name: "Oral polio (OPV)", doses: [pending("6w", "Dose 1"), pending("10w", "Dose 2"), pending("14w", "Dose 3")] },
    { id: "ipv", name: "Inactivated polio (IPV)", doses: [pending("14w", "Dose 1"), pending("9m", "Dose 2")] },
    { id: "pcv", name: "Pneumococcal (PCV)", doses: [pending("6w", "Dose 1"), pending("10w", "Dose 2"), pending("14w", "Dose 3")] },
    { id: "mmr", name: "MMR", doses: [pending("9m", "Dose 1"), pending("12m", "Dose 2")] },
  ],
};
