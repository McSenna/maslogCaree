import type { ReactNode } from "react";
import { Pagination } from "@/components/data-table";
import { PAGE_SIZE } from "../constants/logsLayout";

const MobileLogsView = ({
  content,
  showPagination,
  page,
  total,
  onPageChange,
}: {
  content: ReactNode;
  showPagination: boolean;
  page: number;
  total: number;
  onPageChange: (page: number) => void;
}) => (
  <>
    {content}
    {showPagination ? (
      <Pagination
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        compact
        noun="logs"
        onPageChange={onPageChange}
      />
    ) : null}
  </>
);

export default MobileLogsView;
