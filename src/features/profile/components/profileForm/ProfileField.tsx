import { TextInput, View } from "react-native";
import FieldShell from "./FieldShell";

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

const ProfileField = ({
  label,
  value,
  onChangeText,
  editable = true,
  keyboardType = "default",
  autoCapitalize = "none",
  multiline = false,
  hint,
  error,
}: ProfileFieldProps) => (
  <FieldShell label={label} hint={hint} error={error}>
    <View
      className={`rounded-2xl border bg-slate-50 px-3.5 ${error ? "border-red-400" : "border-slate-200"}`}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        accessibilityLabel={label}
        className={`py-3 text-sm text-slate-800 ${multiline ? "min-h-[48px]" : ""}`}
        placeholderTextColor="#CBD5E1"
      />
    </View>
  </FieldShell>
);

export default ProfileField;
