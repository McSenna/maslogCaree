export const isRouteActive = (pathname: string, href: string): boolean => {
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
};
