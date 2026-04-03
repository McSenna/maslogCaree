import type { ReactNode } from "react";

import { TextInput, View } from "react-native";

export type InputProps = {
  value: string;
  onChangeText: (next: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  className?: string;
  leftIcon?: ReactNode;
};

const Input = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  className = "",
  leftIcon,
}: InputProps) => {
  return (
    <View className={["flex-row items-center gap-2 rounded-xl border border-slate-200 bg-white px-3", className].join(" ")}>
      {leftIcon ? <View className="h-5 w-5 items-center justify-center">{leftIcon}</View> : null}
      <TextInput
        className="flex-1 py-3 text-sm text-slate-800"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#CBD5E1"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );
};

export default Input;

