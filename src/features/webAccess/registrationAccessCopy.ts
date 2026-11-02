import { ERROR_CODES } from "../../utils/errorCodes.ts";

export const registrationAccessNotice = (code?: string) =>
  code === ERROR_CODES.DEVICE_CREDENTIAL_REQUIRED
    ? {
        title: "Account created: device setup required",
        message: "Your email has been verified. Ask the administrator to provision this device, then save the credential under Device setup on the login screen.",
        supporting: "Sign in with the saved credential and your email and password. Your account still needs any required approval.",
      }
    : {
        title: "Account created: web access disabled",
        message: "Your email has been verified. Your web access has been disabled. Please contact the administrator.",
        supporting: "The mobile app is not affected. Mobile sign-in requires a provisioned device credential and your email and password.",
      };
