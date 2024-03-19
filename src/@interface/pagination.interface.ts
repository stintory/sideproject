export interface PaginationResult<T> {
  data: T[];
  totalResults?: number;
  meta?: {
    page: number;
    size: number;
    total: number;
    pageCount?: number;
    totalResults?: number;
    limit?: number;
  };
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface PaginationOptions {
  page?: number;
  skip?: number;
  limit?: number;
  size?: number;
  sort?: SortCriteria[];
  search?: Record<any, any>[];
  order?: SortOrder[];
}

export interface SortCriteria {
  [field: string]: 'ASC' | 'DESC';
}
