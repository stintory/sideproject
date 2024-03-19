import { Types, UpdateQuery } from 'mongoose';

export interface Repository<T> {
  create(data: Partial<T>): Promise<T>;

  findAll(): Promise<T[]>;

  find(object: Partial<T>): Promise<T[]>;

  findById(id: string | Types.ObjectId): Promise<T>;

  findOne(object: Partial<T>): Promise<T | null>;

  update(object: Partial<T>, updateObject: Partial<T> | UpdateQuery<T>): Promise<T | null>;

  updateById(id: string | Types.ObjectId, updateObject: Partial<T> | UpdateQuery<T>): Promise<T | null>;

  delete(object: Partial<T>): Promise<T | null>;

  deleteById(id: string | Types.ObjectId): Promise<T | null>;
}
