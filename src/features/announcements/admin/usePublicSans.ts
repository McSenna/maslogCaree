import { PublicSans_400Regular } from "@expo-google-fonts/public-sans/400Regular";
import { PublicSans_500Medium } from "@expo-google-fonts/public-sans/500Medium";
import { PublicSans_600SemiBold } from "@expo-google-fonts/public-sans/600SemiBold";
import { PublicSans_700Bold } from "@expo-google-fonts/public-sans/700Bold";
import { useFonts } from "expo-font";

// Per-weight imports keep the other fourteen Public Sans files out of the bundle.
const FONTS = { PublicSans_400Regular, PublicSans_500Medium, PublicSans_600SemiBold, PublicSans_700Bold };

/** True once the four weights the `font-ps*` classes name are ready to draw. */
export const usePublicSans = (): boolean => {
  const [loaded, error] = useFonts(FONTS);
  // A font that fails to load falls back to the system face rather than blocking the screen.
  return loaded || Boolean(error);
};
