import { SortParams } from './agSearchParams';

export type SearchTypeText = {
  contains?: string | unknown;
  equals?: string | unknown;
  not?: string | unknown;
  startsWith?: string | unknown;
  endsWith?: string | unknown;
};

export type SearchTypeNumber = {
  equals?: number | unknown;
  not?: number | unknown;
  lt?: number | unknown;
  lte?: number | unknown;
  gt?: number | unknown;
  gte?: number | unknown;
};

export type SearchTypeEnum = {
  equals?: string;
  in?: string[];
  notIn?: string[];
  not?: string;
};

export type SearchTypeDate = {
  contains?: Date | unknown;
  equals?: Date | unknown;
  not?: Date | unknown;
  gte?: Date | unknown;
  lt?: Date | unknown;
};

export type SearchTypeBool = {
  [key: string]: boolean;
};

export type SearchParams = {
  [key: string]:
    | SearchTypeText
    | SearchTypeNumber
    | SearchTypeEnum
    | SearchTypeDate
    | SearchTypeBool
    | SearchType[];

  AND?: SearchType[];
  OR?: SearchType[];
  NOT?: SearchType[];
};

type SearchType = {
  [key: string]:
    | SearchTypeText
    | SearchTypeNumber
    | SearchTypeEnum
    | SearchTypeDate
    | SearchTypeBool;
};

export type ApiDataParams = {
  newPage: number;
  searchParams: SearchParams;
  sortParams: SortParams;
};
