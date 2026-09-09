/**
 * Decides whether a bottom-nav destination is the one currently on screen.
 *
 * Mirrors the matching the sidebar already does, so a role's sidebar and its
 * bottom bar never disagree about which section the user is in:
 *  - exact match
 *  - the "/" home route, which must never match by prefix
 *  - a "/<role>/dashboard" item while sitting on the role's index route
 *  - nested detail routes (e.g. /resident/appointments/new)
 */
export function isRouteActive(pathname: string, href: string): boolean {
  if (!pathname) return false;
  if (pathname === href) return true;

  if (href === "/") {
    return pathname === "/index" || pathname === "";
  }

  if (href.endsWith("/dashboard")) {
    const base = href.slice(0, -"/dashboard".length);
    if (pathname === base || pathname === `${base}/`) return true;
  }

  return pathname.startsWith(`${href}/`);
}
