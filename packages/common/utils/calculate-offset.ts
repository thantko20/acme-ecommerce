export const calculatePaginationOffset = (page: number, limit: number) =>
  (page - 1) * limit;
