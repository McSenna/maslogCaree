import type { Feather } from "@expo/vector-icons";
import StateBlock from "@/components/ui/StateBlock";
import { useInventoryPalette } from "./inventoryTheme";

type InventoryStateBlockProps = {
  icon: keyof typeof Feather.glyphMap;
  tone: "neutral" | "error";
  title: string;
  body: string;
  action?: { label: string; onPress: () => void };
};

/** The shared admin state block, in Inventory's own error tint. */
export default function InventoryStateBlock(props: InventoryStateBlockProps) {
  const palette = useInventoryPalette();
  return <StateBlock {...props} dangerColor={palette.danger} />;
}
