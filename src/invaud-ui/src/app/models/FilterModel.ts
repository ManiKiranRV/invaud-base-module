export interface FilterModel {
    [key: string]: Filter | ConditionalFilter;
  }
  
  export interface ConditionalFilter {
    filterType: string;
    operator: string;
    condition1: Filter;
    condition2: Filter;
  }
  
  export interface Filter {
    filterType: string;
    type: string;
    filter: string;
  }
  