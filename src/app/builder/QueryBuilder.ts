/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query?.searchTerm as string | undefined;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query } as Record<string, any>; // copy and cast to a plain object

    // Make string queries case-insensitive, but exclude 'isAvailable'
    const caseInsensitiveQueryObj = Object.keys(queryObj).reduce(
      (acc, key) => {
        if (key === 'isAvailable') {
          acc[key] = queryObj[key]; // directly assign without modification
        } else if (typeof queryObj[key] === 'string') {
          acc[key] = new RegExp(queryObj[key], 'i'); // case-insensitive regex
        } else {
          acc[key] = queryObj[key]; // keep other types unchanged
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    this.modelQuery = this.modelQuery.find(caseInsensitiveQueryObj);

    return this;
  }
}

export default QueryBuilder;
