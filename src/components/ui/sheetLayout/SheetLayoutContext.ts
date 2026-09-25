import { createContext, useContext } from "react";

import type { SheetLayout } from "./useSheetLayout";

const SheetLayoutContext = createContext<SheetLayout | null>(null);

export const SheetLayoutProvider = SheetLayoutContext.Provider;

/**
 * Lets pieces rendered inside a sheet (footers, action rows) read its layout
 * without adding keyboard listeners of their own. Null outside a SheetViewport.
 */
export const useSheetLayoutContext = (): SheetLayout | null => useContext(SheetLayoutContext);
