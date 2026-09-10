import { Text } from "react-native";

/** The small caps label above every registration field. */
export default function FieldLabel({ children }: { children: string }) {
  return (
    <Text className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
      {children}
    </Text>
  );
}
