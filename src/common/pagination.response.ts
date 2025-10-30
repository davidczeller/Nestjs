export interface PaginationResponse<T> {
  data: T[];
  meta: {
    totalItems: number;
    offset: number;
    limit: number;
  };
}
