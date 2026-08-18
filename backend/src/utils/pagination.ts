export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
}

export const getPagination = (
  pageValue?: string,
  limitValue?: string
): PaginationResult => {
  const page = Math.max(Number(pageValue) || 1, 1);

  const limit = Math.min(
    Math.max(Number(limitValue) || 50, 1),
    100
  );

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

export const getPaginationMeta = (
  page: number,
  limit: number,
  total: number
) => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPreviousPage: page > 1,
  };
};