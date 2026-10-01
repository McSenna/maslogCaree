import TextField from "@/components/forms/TextField";

type ProfileFieldProps = {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
  hint?: string;
  error?: string;
};

const ProfileField = ({ hint, editable = true, ...props }: ProfileFieldProps) => (
  <TextField {...props} helper={hint} disabled={!editable} maxFontSizeMultiplier={1.3} />
);

export default ProfileField;
