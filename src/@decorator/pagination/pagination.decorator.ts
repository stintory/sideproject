import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { PaginationOptions } from '../../@interface/pagination.interface';

export const PaginationDecorator = createParamDecorator((data, ctx: ExecutionContext): PaginationOptions => {
  const req: Request = ctx.switchToHttp().getRequest();

  const paginationParams: PaginationOptions = {
    page: req.query.page ? parseInt(req.query.page.toString()) : 1,
    skip: req.query.skip ? parseInt(req.query.skip.toString()) : 0,
    limit: req.query.limit ? parseInt(req.query.limit.toString()) : 10,
    sort: [],
    search: [],
  };

  if (req.query.sort && req.query.order) {
    const sortArray = req.query.sort.toString().split(',');
    const orderArray = req.query.order.toString().split(',');
    if (sortArray.length === orderArray.length) {
      paginationParams.sort = sortArray
        .map((sortItem, index) => {
          const order = orderArray[index].toUpperCase();
          if (order === 'ASC' || order === 'DESC') {
            return {
              [sortItem]: order as 'ASC' | 'DESC',
            };
          }
        })
        .filter((item) => item);
    }
  }
  if (req.query.search) {
    const searchArray = req.query.search.toString().split(',');
    paginationParams.search = searchArray.map((searchItem) => {
      const [field, value] = searchItem.split(':');
      return {
        [field]: value,
      };
    });
  }
  return paginationParams;
});
