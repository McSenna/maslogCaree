import { Text, TextInput, View } from "react-native";

type ProfileFieldProps = {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
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
  error,
}: ProfileFieldProps) => (
  <View>
    <Text className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </Text>
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
    {error ? (
      <Text accessibilityLiveRegion="polite" className="mt-1 text-[11px] text-red-500">
        {error}
      </Text>
    ) : null}
  </View>
);

export default ProfileField;
