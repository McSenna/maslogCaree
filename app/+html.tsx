import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

/**
 * Web-only document shell for the static export. Same as Expo's default
 * (charset, viewport, scroll reset) plus the home-screen icons and manifest in
 * /public. The favicon itself comes from `web.favicon` in app.json.
 */
const Root = ({ children }: PropsWithChildren) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="description" content="Book and track health center appointments in Barangay 61 Maslog, Legazpi City." />
      <meta name="theme-color" content="#1565D8" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
      <link rel="manifest" href="/manifest.json" />
      <ScrollViewStyleReset />
    </head>
    <body>{children}</body>
  </html>
);

export default Root;
