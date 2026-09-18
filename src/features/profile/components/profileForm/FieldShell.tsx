import type { ReactNode } from "react";
import { Text, View } from "react-native";

type FieldShellProps = {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

const FieldShell = ({ label, hint, error, children }: FieldShellProps) => (
  <View>
    <View className="mb-1.5 flex-row items-center gap-2">
      <Text className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </Text>
      {hint ? <Text className="text-[11px] font-medium text-slate-300">{hint}</Text> : null}
    </View>

    {children}

    {error ? (
      <Text accessibilityLiveRegion="polite" className="mt-1 text-[11px] text-red-500">
        {error}
      </Text>
    ) : null}
  </View>
);

export default FieldShell;
