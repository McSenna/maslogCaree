import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Text, TextInput, View } from "react-native";

import { INPUT_SHELL_PROPS } from "@/components/ui/inputShell";

type Props = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  focused: boolean;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  onFocus: () => void;
  onBlur: () => void;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences";
  keyboardType?: "default" | "email-address";
  trailing?: ReactNode;
};

const LoginField = ({
  label,
  icon,
  focused,
  value,
  onChangeText,
  placeholder,
  onFocus,
  onBlur,
  secureTextEntry,
  autoCapitalize,
  keyboardType,
  trailing,
}: Props) => {
  return (
    <View>
      <Text className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </Text>
      <View
        {...INPUT_SHELL_PROPS}
        className="flex-row items-center rounded-xl border px-3"
        style={{
          borderColor: focused ? "#3B5BDB" : "#E2E8F0",
          backgroundColor: focused ? "#EEF2FF" : "#F8FAFC",
          height: 46,
        }}
      >
        <Feather name={icon} size={14} color={focused ? "#3B5BDB" : "#94A3B8"} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          onFocus={onFocus}
          onBlur={onBlur}
          className="flex-1 pl-2.5 text-sm text-slate-800"
          placeholderTextColor="#CBD5E1"
          underlineColorAndroid="transparent"
        />
        {trailing}
      </View>
    </View>
  );
};

export default LoginField;
