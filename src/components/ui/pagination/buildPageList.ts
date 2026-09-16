export const buildPageList = (page: number, totalPages: number): (number | "ellipsis")[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages, page]);
  if (page - 1 > 1) pages.add(page - 1);
  if (page + 1 < totalPages) pages.add(page + 1);

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  sorted.forEach((p, idx) => {
    if (idx > 0 && p - sorted[idx - 1] > 1) result.push("ellipsis");
    result.push(p);
  });
  return result;
};
