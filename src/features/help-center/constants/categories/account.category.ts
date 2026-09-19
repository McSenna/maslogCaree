import type { HelpCategory } from "../../types/helpCenter.types";

export const ACCOUNT_CATEGORY: HelpCategory = {
  id: "account",
  title: "Account & Registration",
  description:
    "Get help with registration, identity verification, account approval, login, and password recovery.",
  icon: "user-check",
  tone: "green",
  articles: [
    {
      id: "create-account",
      title: "Creating an account",
      summary:
        "Register with your personal details, verify your email, then upload a valid government ID for review.",
      keywords: ["register", "registration", "sign up", "create account"],
    },
    {
      id: "email-verification",
      title: "Email verification",
      summary: "A verification message is sent to the email address you registered with.",
      keywords: ["email", "verify", "verification", "confirm"],
    },
    {
      id: "otp-verification",
      title: "OTP verification",
      summary:
        "Enter the one-time code sent to your email. Codes expire, so request a new one if it lapses.",
      keywords: ["otp", "code", "one time password", "expired", "resend"],
    },
    {
      id: "valid-id-upload",
      title: "Uploading a valid ID",
      summary:
        "Upload a clear photo of a government-issued ID in JPG, PNG, or PDF format for identity verification.",
      keywords: ["id", "valid id", "upload", "document", "philsys"],
    },
    {
      id: "account-approval",
      title: "Resident account approval",
      summary:
        "Resident accounts require administrator approval before they are activated. You are notified once the review is done.",
      keywords: ["approval", "approve", "activation", "review"],
    },
    {
      id: "pending-account",
      title: "Pending accounts",
      summary: "A pending account is awaiting administrator review of your details and ID.",
      keywords: ["pending", "waiting", "not approved"],
    },
    {
      id: "rejected-registration",
      title: "Rejected registrations",
      summary:
        "Rejections include a reason. Correct the issue and submit a new registration, or contact support.",
      keywords: ["rejected", "declined", "denied"],
    },
    {
      id: "login-issues",
      title: "Login issues",
      summary:
        "Check your email address and password. Suspended or unapproved accounts cannot sign in.",
      keywords: ["login", "sign in", "cannot login", "locked"],
    },
    {
      id: "forgot-password",
      title: "Forgot password",
      summary: "Use Forgot Password on the login screen to receive a recovery code by email.",
      keywords: ["forgot", "password", "recovery", "reset"],
    },
    {
      id: "reset-password",
      title: "Resetting your password",
      summary:
        "Enter the recovery code, then set a new password that meets the security requirements.",
      keywords: ["reset", "password", "change password", "new password"],
    },
    {
      id: "update-personal-info",
      title: "Updating personal information",
      summary:
        "Edit your details from My Profile. Verified fields may require staff assistance to change.",
      keywords: ["update", "edit", "personal information", "profile", "correct"],
    },
  ],
};
