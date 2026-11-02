/** Words for the confirmation dialogs. Import-free so `node --test` can load it. */

export type ConfirmCopy = { title: string; body: string; confirmLabel: string; destructive: boolean };
export type ConfirmAction = "deactivate" | "reactivate" | "approve" | "resetPassword" | "changeRole";

export const confirmCopy = (action: ConfirmAction, name: string, detail = ""): ConfirmCopy => {
  switch (action) {
    case "deactivate":
      return {
        title: `Deactivate ${name}?`,
        body: "They will be signed out and cannot sign in. Their records stay, and you can reactivate the account anytime.",
        confirmLabel: "Deactivate account",
        destructive: true,
      };
    case "reactivate":
      return {
        title: `Reactivate ${name}?`,
        body: "They will be able to sign in again with their current password.",
        confirmLabel: "Reactivate account",
        destructive: false,
      };
    case "approve":
      return {
        title: `Approve ${name}?`,
        body: "No ID is on file for this request. They will be able to sign in as soon as you approve it.",
        confirmLabel: "Approve request",
        destructive: false,
      };
    case "resetPassword":
      return {
        title: `Send a password reset to ${name}?`,
        body: "They will get an email with a code to set a new password. You will not see the code or the password.",
        confirmLabel: "Send reset code",
        destructive: false,
      };
    case "changeRole":
      return {
        title: `Change ${name}'s role?`,
        body: `They will become ${detail} and their access changes right away. They will need to reconnect.`,
        confirmLabel: "Change role",
        destructive: true,
      };
  }
};

/** `identity` tells two residents with the same name apart. */
export const webAccessCopy = (override: "allow" | "block" | null, identity: string, globalEnabled: boolean): ConfirmCopy => {
  if (override === "allow") {
    return {
      title: "Enable web access?",
      body: `${identity} can use the web portal after signing in. Account status and verification rules still apply. The mobile app is not affected.`,
      confirmLabel: "Enable web access",
      destructive: false,
    };
  }
  if (override === "block") {
    return {
      title: "Disable web access?",
      body: `${identity} loses the web portal on their next action and cannot sign in there. Their records and the mobile app are not affected.`,
      confirmLabel: "Disable web access",
      destructive: true,
    };
  }
  return {
    title: "Use the global setting?",
    body: `${identity} will follow the global switch, which is ${globalEnabled ? "On" : "Off"}. The mobile app is not affected.`,
    confirmLabel: "Use global setting",
    destructive: false,
  };
};

export const globalAccessCopy = (turningOn: boolean): ConfirmCopy =>
  turningOn
    ? {
        title: "Turn on resident web access?",
        body: "Every eligible resident with no individual setting can use the web portal right away. Residents you blocked individually stay blocked.",
        confirmLabel: "Turn on web access",
        destructive: false,
      }
    : {
        title: "Turn off resident web access?",
        body: "Residents with no individual setting lose the web portal right away. Residents you allowed individually keep it. The mobile app is not affected.",
        confirmLabel: "Turn off web access",
        destructive: true,
      };
