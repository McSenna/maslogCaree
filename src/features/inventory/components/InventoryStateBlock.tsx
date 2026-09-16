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

const InventoryStateBlock = (props: InventoryStateBlockProps) => {
  const palette = useInventoryPalette();
  return <StateBlock {...props} dangerColor={palette.danger} />;
};

export default InventoryStateBlock;
