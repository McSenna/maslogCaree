import { useEffect, useRef, type ReactNode } from "react";
import { Platform, View } from "react-native";

import type { MasterFormField } from "../../masterResidentForm";

export type FieldRegistry = Partial<Record<MasterFormField, View | null>>;

type Props = {
  field: MasterFormField;
  error?: string;
  required?: boolean;
  registerField: (field: MasterFormField, node: View | null) => void;
  children: ReactNode;
};

/** Adds local error associations to the existing shared registration controls. */
const MasterEditorField = ({
  field,
  error,
  required,
  registerField,
  children,
}: Props) => {
  const ref = useRef<View>(null);
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const node = ref.current as unknown as HTMLElement | null;
    const errorNode = node?.querySelector<HTMLElement>('[role="alert"]');
    if (errorNode) errorNode.id = `master-error-${field}`;
    node
      ?.querySelectorAll<HTMLElement>('input, [role="button"], [role="radio"]')
      .forEach((control) => {
        control.setAttribute("aria-invalid", String(Boolean(error)));
        if (required && control.tagName === "INPUT")
          control.setAttribute("aria-required", "true");
        if (error)
          control.setAttribute("aria-describedby", `master-error-${field}`);
        else control.removeAttribute("aria-describedby");
      });
  }, [field, error, required]);

  return (
    <View
      ref={(node) => {
        ref.current = node;
        registerField(field, node);
      }}
      collapsable={false}
      style={{ width: "100%" }}
    >
      {children}
    </View>
  );
};

export default MasterEditorField;
