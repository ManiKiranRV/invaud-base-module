import { SearchParams } from "../models/agModels";

export const filterBuilder = (
  searchParams: SearchParams,
  api: {
    [key: string]: any;
  },
): void => {
  // Build search params
  for (const [key, value] of Object.entries<IFilterValue>(api)) {
    if (value.type === 'notContains') {
      mapNotContains(key, value.filter, searchParams);
    } else if (value.operator) {
      mapAndOr(key, value, searchParams);
    } else if (value.dateFrom) {
      buildDateParameter(key, value, searchParams);
    } else if (value.type === 'inRange') {
      buildRangeParameter(key, value.filter, value.filterTo, searchParams);
    } else {
      buildBasicSearchParameter(key, value.type, value.filter, searchParams);
    }
  }
};

const buildDateParameter = (
  key: string,
  value: IFilterValue,
  searchParams: SearchParams,
) => {
  if (value.type === 'inRange') {
    buildDateRangeParameter(key, value.dateFrom, value.dateTo, searchParams);
  } else if (value.type === 'equals') {
    buildDateRangeParameter(key, value.dateFrom, value.dateFrom, searchParams);
  } else {
    buildBasicSearchParameter(
      key,
      value.type,
      formatDate(value.dateFrom),
      searchParams,
    );
  }
};

const mapAndOr = (
  key: string,
  value: IFilterValue,
  searchParams: SearchParams,
) => {
  // Reset key outside of and / or operator array
  buildBasicSearchParameter(key, value.condition1.type, '', searchParams);

  if (value.operator === 'AND') {
    buildAndParameters(key, value, searchParams);
  } else if (value.operator === 'OR') {
    buildOrParameters(key, value, searchParams);
  }
};

const mapNotContains = (
  key: string,
  filter: string | number,
  searchParams:SearchParams,
) => {
  // Reset key outside of not operator array
  buildBasicSearchParameter(key, 'contains', '', searchParams);

  buildNotParameters(key, filter, searchParams);
};

const buildAndParameters = (
  key: string,
  value: IFilterValue,
  searchParams: SearchParams,
): void => {
  if (!searchParams.AND) {
    searchParams['AND'] = [];
  }
  searchParams.AND.push(
    {
      [key]: {
        [formatTypeForPrisma(value.condition1.type)]: value.condition1.filter,
      },
    },
    {
      [key]: {
        [formatTypeForPrisma(value.condition2.type)]: value.condition2.filter,
      },
    },
  );
};

const buildOrParameters = (
  key: string,
  value: IFilterValue,
  searchParams: SearchParams,
): void => {
  if (!searchParams.OR) {
    searchParams['OR'] = [];
  }
  searchParams.OR.push(
    {
      [key]: {
        [formatTypeForPrisma(value.condition1.type)]: value.condition1.filter,
      },
    },
    {
      [key]: {
        [formatTypeForPrisma(value.condition2.type)]: value.condition2.filter,
      },
    },
  );
};

const buildNotParameters = (
  key: string,
  filter: string | number,
  searchParams: SearchParams,
): void => {
  if (!searchParams.NOT) {
    searchParams['NOT'] = [];
  }
  searchParams.NOT.push({
    [key]: {
      ['contains']: filter,
    },
  });
};

const buildBasicSearchParameter = (
  key: string,
  type: string,
  filtervalue: string | number | Date,
  searchParams: SearchParams,
): void => {
  searchParams[key] = {
    [formatTypeForPrisma(type)]: filtervalue,
  };
};

const buildRangeParameter = (
  key: string,
  from: string | number,
  to: string | number,
  searchParams: SearchParams,
): void => {
  searchParams[key] = {
    gte: from,
    lte: to,
  };
};

const buildDateRangeParameter = (
  key: string,
  dateFrom: string,
  dateTo: string,
  searchParams: SearchParams,
): void => {
  searchParams[key] = {
    gte: formatDate(dateFrom),
    lte: formatDateLate(dateTo),
  };
};

const formatDate = (date: string): string => {
  return `${date.replace(' ', 'T')}+00:00`;
};
const formatDateLate = (date: string): string => {
  return `${date.substr(0, 10)}T23:59:59+00:00`;
};

const formatTypeForPrisma = (type: string): string => {
  switch (type) {
    case 'greaterThan':
      return 'gt';
    case 'greaterThanOrEqual':
      return 'gte';
    case 'lessThan':
      return 'lt';
    case 'lessThanOrEqual':
      return 'lte';
    case 'notEqual':
      return 'not';
    default:
      return type;
  }
};

interface IFilterValue {
  type: string;
  operator?: string;
  filterTo?: string | number;
  dateFrom?: string;
  dateTo?: string;
  filter?: string | number;
  condition1?: {
    type: string;
    filter: string;
  };
  condition2?: {
    type: string;
    filter: string;
  };
}
