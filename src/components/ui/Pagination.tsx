import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import DesktopPagination from "./pagination/DesktopPagination";
import MobilePagination from "./pagination/MobilePagination";

type PaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  isDesktop: boolean;
  onPageChange: (page: number) => void;
  noun?: string;
};

const Pagination = ({
  page,
  totalPages,
  total,
  pageSize,
  isDesktop,
  onPageChange,
  noun = "users",
}: PaginationProps) => {
  const palette = useAdminSurfacePalette();

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const summary = `Showing ${start.toLocaleString()}–${end.toLocaleString()} of ${total.toLocaleString()} ${noun}`;

  return isDesktop ? (
    <DesktopPagination page={page} totalPages={totalPages} summary={summary} onPageChange={onPageChange} palette={palette} />
  ) : (
    <MobilePagination page={page} totalPages={totalPages} summary={summary} onPageChange={onPageChange} palette={palette} />
  );
};

export default Pagination;
