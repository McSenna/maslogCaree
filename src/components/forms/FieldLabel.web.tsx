import type { CSSProperties } from "react";

import type { FieldLabelProps } from "./FieldLabel";

const LABEL_STYLE: CSSProperties = { display: "block", cursor: "pointer" };

/** A real label element, so pressing the text focuses the input. Needs the input's id to do that. */
const FieldLabel = ({ htmlFor, children }: FieldLabelProps) =>
  htmlFor ? (
    <label htmlFor={htmlFor} style={LABEL_STYLE}>
      {children}
    </label>
  ) : (
    <>{children}</>
  );

export default FieldLabel;
