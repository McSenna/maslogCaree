import type { ReactNode } from "react";
import { View } from "react-native";

type FormRowProps = {
  twoColumn: boolean;
  children: ReactNode;
};

const FormRow = ({ twoColumn, children }: FormRowProps) => (
  <View
    style={{
      flexDirection: twoColumn ? "row" : "column",
      gap: twoColumn ? 16 : 18,
      width: "100%",
    }}
  >
    {(Array.isArray(children) ? children : [children]).map((child, index) => (
      <View key={index} style={{ flex: twoColumn ? 1 : undefined, minWidth: 0 }}>
        {child}
      </View>
    ))}
  </View>
);

export default FormRow;
