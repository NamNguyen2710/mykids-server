export interface ListResponseDto<T> {
  data: T[];
  pagination: {
    totalItem: number;
    totalPage: number;
    page: number;
    limit: number;
  };
}
