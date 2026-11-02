/**
 * Users table column widths. Import-free so `node --test` can load it. The
 * totals must stay under the table's width at a 1280px window, or the page
 * falls back to cards there.
 */
// At 1280px the role folds under the name (see userColumns), and long names wrap to two lines.
export const COLUMN_WIDTHS = { userMin: 200, role: 124, status: 160, access: 220, lastLogin: 134, actions: 228 } as const;

/** Five 36px icons and their gaps. A fixed block, so rows with fewer icons still line up while staying centred. */
export const INLINE_ACTIONS_WIDTH = 5 * 36 + 4 * 4;

export const actionWidthsForPermission = (canManageWebAccess: boolean) => {
  const hiddenActionWidth = canManageWebAccess ? 0 : 36 + 4;
  return { block: INLINE_ACTIONS_WIDTH - hiddenActionWidth, column: COLUMN_WIDTHS.actions - hiddenActionWidth };
};
