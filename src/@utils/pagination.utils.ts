import { Document, FilterQuery, Model, ProjectionType } from 'mongoose';
import { PaginationOptions, PaginationResult } from '../@interface/pagination.interface';

export async function getPaginate<T extends Document>(
  model: Model<T>,
  condition: FilterQuery<T>,
  options: PaginationOptions,
  projections?: ProjectionType<T>,
): Promise<PaginationResult<T>> {
  const { page, limit, sort, search } = options;
  const pageSize = limit || 10;

  let skip = pageSize * (page - 1);
  if (page && page > 1) {
    skip = (page - 1) * pageSize;
  }

  let query = model.find(condition, projections);

  if (skip) {
    query = query.skip(skip);
  }
  if (limit) {
    query = query.limit(limit);
  }

  if (sort && sort.length > 0) {
    const sortCriteria: any = {}; // any 타입으로 변경
    sort.forEach((sortItem) => {
      const field = Object.keys(sortItem)[0];
      const order = sortItem[field];
      sortCriteria[field] = order === 'ASC' ? 1 : -1; // ASC는 1, DESC는 -1로 변환
    });
    query = query.sort(sortCriteria);
  }

  if (search && search.length > 0) {
    const searchCriteria = {};
    search.forEach((searchItem) => {
      Object.entries(searchItem).forEach(([field, value]) => {
        // 필드가 날짜인 경우에만 해당 로직을 적용
        if (field === 'createdAt') {
          const startDate = new Date(`${value} 00:00:00Z`);
          const endDate = new Date(`${value} 24:00:00Z`); // 해당 날짜의 마지막 시간 설정
          searchCriteria[field] = {
            $gte: startDate,
            $lte: endDate,
          };
        } else {
          searchCriteria[field] = value;
        }
      });
    });
    query = query.where(searchCriteria);
  }

  const [data, totalResults] = await Promise.all([query.exec(), model.countDocuments(condition)]);

  return {
    data,
    totalResults,
  };
}
