import { useId } from "react";

/**
 * A document-unique id for SVG <defs> (gradients, clip paths). Fixed ids break on web as soon as two
 * charts are mounted at once — e.g. a screen kept alive in the navigation stack — because
 * `url(#id)` resolves to the first match, which may be hidden, leaving fills blank.
 */
export const useSvgId = (prefix: string): string =>
  `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
