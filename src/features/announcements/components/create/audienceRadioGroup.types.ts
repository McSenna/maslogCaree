import type { Audience } from "../../announcement.types";

export type AudienceRadioGroupProps = {
  value: Audience;
  onChange: (value: Audience) => void;
  disabled?: boolean;
};

export const AUDIENCE_LEGEND = "Audience";
