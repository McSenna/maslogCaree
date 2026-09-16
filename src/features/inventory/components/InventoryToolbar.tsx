import DesktopToolbar from "./toolbar/DesktopToolbar";
import MobileToolbar from "./toolbar/MobileToolbar";
import type { InventoryToolbarFilters } from "./toolbar/toolbarProps";

type InventoryToolbarProps = InventoryToolbarFilters & {
  isDesktop: boolean;
  resultCount?: number;
};

const InventoryToolbar = ({ isDesktop, resultCount = 0, ...filters }: InventoryToolbarProps) => {
  return isDesktop ? (
    <DesktopToolbar {...filters} />
  ) : (
    <MobileToolbar {...filters} resultCount={resultCount} />
  );
};

export default InventoryToolbar;
