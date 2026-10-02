import { View } from "react-native";

import DesktopPagination from "@/components/ui/pagination/DesktopPagination";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import { pageCount, rangeLine } from "../../hooks/screenView";
import { CardBottom } from "@/components/dashboard/kit/TableCard";

type TableFooterProps = {
  page: number;
  pageSize: number;
  shown: number;
  total: number;
  onPage: (page: number) => void;
};

/** Closes the table card: the range shown and the shared page buttons. */
const TableFooter = ({ page, pageSize, shown, total, onPage }: TableFooterProps) => {
  const palette = useAdminSurfacePalette();
  return (
    <CardBottom>
      <View className="border-t border-divider px-1 pt-3">
        <DesktopPagination
          palette={palette}
          page={page}
          totalPages={pageCount(total, pageSize)}
          summary={rangeLine(page, pageSize, shown, total)}
          onPageChange={onPage}
        />
      </View>
    </CardBottom>
  );
};

export default TableFooter;
