// Import-free (types only) so `node --test` can load it.
import type { MasterListReview, MasterResidentRecord } from "../../../services/userRequestTypes";

/**
 * The admin's link decision on approval: a master list ID to link, null to
 * keep the account unlinked, or undefined to leave it to the clean-match rule.
 */
export type LinkChoice = string | null | undefined;

/**
 * Records the admin may pick from. Only when sign-up did not find one clean
 * match: a clean match already links itself on approval.
 */
export const choosableCandidates = (review: MasterListReview | null | undefined, isPending: boolean): MasterResidentRecord[] => {
  if (!isPending || !review || review.outcome === "matched") return [];
  return review.candidates.filter((record) => !record.missing && record.isActive !== false);
};

/** The sentence the approve confirmation adds about the link. */
export const linkChoiceSentence = (choice: LinkChoice, hasChoices: boolean): string => {
  if (typeof choice === "string") {
    return ` It also links the account to master list record ${choice}, so medical records filed under that record show in this account.`;
  }
  return hasChoices ? " The account stays unlinked from the master list." : "";
};
