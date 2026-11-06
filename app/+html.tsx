import { ScrollViewStyleReset, useServerDocumentContext } from "expo-router/html";
import type { PropsWithChildren } from "react";
import { PALETTE } from "@/theme/palette";
import { webFontFaceCss } from "@/theme/webFonts";

/**
 * Web-only document shell for the static export. Same as Expo's default
 * (charset, viewport, scroll reset) plus the home-screen icons, manifest and
 * Inter font files in /public. The favicon itself comes from `web.favicon` in app.json.
 *
 * Since Expo SDK 58 the export no longer appends the JS bundles and stylesheets
 * to the finished HTML: this shell must render `headNodes` and `bodyNodes`.
 * Without them every page is static markup that never loads its JavaScript.
 */
const Root = ({ children }: PropsWithChildren) => {
  const { htmlAttributes, bodyAttributes, headNodes, bodyNodes } = useServerDocumentContext();
  return (
    <html lang="en" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="Book and track health center appointments in Barangay 61 Maslog, Legazpi City." />
        <meta name="theme-color" content={PALETTE.blue[600]} />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: webFontFaceCss() }} />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
};

export default Root;
