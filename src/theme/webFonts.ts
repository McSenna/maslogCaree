/** Inter on web. Import-free so `node --test` can load it. */

export const INTER_FACES = [
  { weight: 400, file: "Inter_400Regular.ttf" },
  { weight: 500, file: "Inter_500Medium.ttf" },
  { weight: 600, file: "Inter_600SemiBold.ttf" },
  { weight: 700, file: "Inter_700Bold.ttf" },
] as const;

// react-native-web gives every Text the stack that starts with -apple-system. An
// @font-face under that name wins over any installed font, so all text becomes
// Inter from this one place, and icon fonts, which name their own family, are untouched.
const FAMILIES = ["Inter", "-apple-system"];

/** For plain DOM elements (e.g. a description list) that do not get react-native-web's Text stack. */
export const WEB_FONT_STACK = '"Inter", -apple-system, system-ui, sans-serif';

export const webFontFaceCss = (): string =>
  FAMILIES.flatMap((family) =>
    INTER_FACES.map(
      ({ weight, file }) =>
        `@font-face{font-family:"${family}";font-weight:${weight};font-style:normal;font-display:swap;src:url("/fonts/${file}") format("truetype")}`
    )
  ).join("");
