import type { ReactNode } from "react";
import Pagination from "@/components/ui/Pagination";
import { PAGE_SIZE } from "../constants/logsLayout";

const MobileLogsView = ({
  content,
  showPagination,
  page,
  totalPages,
  total,
  onPageChange,
}: {
  content: ReactNode;
  showPagination: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}) => (
  <>
    {content}
    {showPagination ? (
      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={PAGE_SIZE}
        isDesktop={false}
        noun="logs"
        onPageChange={onPageChange}
      />
    ) : null}
  </>
);

export default MobileLogsView;
