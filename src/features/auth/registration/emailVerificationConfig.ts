import { isValidEmailAddress } from "../../../utils/emailAddress.ts";

export const OTP_LENGTH = 6;

/** The shared email rule: any provider, only the shape is checked. */
export const isValidEmailFormat = (email: string) => isValidEmailAddress(email);
