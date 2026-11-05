import type { ReactNode } from "react";

export type FieldLabelProps = { htmlFor?: string; children: ReactNode };

/** Native screen readers take the name from the input, so the visible text is enough here. */
const FieldLabel = ({ children }: FieldLabelProps) => <>{children}</>;

export default FieldLabel;
