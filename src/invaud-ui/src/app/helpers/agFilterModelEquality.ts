import { ConditionalFilter, Filter, FilterModel } from '../models/FilterModel';

const typedKeys = <T>(o: T): (keyof T)[] => {
  // type cast should be safe because that's what really Object.keys() does
  return Object.keys(o) as (keyof T)[];
};

const filterModelEquals = (
  filterListOne: FilterModel,
  filterListTwo: FilterModel
): Boolean => {
  if (filterListOne == null || filterListTwo == null) {
    return false;
  }

  const keysOne = typedKeys(filterListOne);
  const keysTwo = typedKeys(filterListTwo);

  if (keysOne.length != keysTwo.length) {
    return false;
  }

  for (let index = 0; index < keysOne.length; index++) {
    const keyTwoIndex = keysTwo.findIndex((key) => key == keysOne[index]);

    if (keyTwoIndex == -1) {
      // Key not found
      return false;
    } else {
      // Key exists in second array thus comparison is possible
      if (Object.keys(filterListOne[keysOne[index]]).includes('operator')) {
        return conditionalFilterEquals(
          <ConditionalFilter>filterListOne[keysOne[index]],
          <ConditionalFilter>filterListTwo[keysTwo[keyTwoIndex]]
        );
      }

      return filterEquals(
        <Filter>filterListOne[keysOne[index]],
        <Filter>filterListTwo[keysTwo[keyTwoIndex]]
      );
    }
  }
  return false;
};

const filterEquals = (filterOne: Filter, filterTwo: Filter): Boolean => {
  return (
    filterOne.filter == filterTwo.filter && filterOne.type == filterTwo.type
  );
};

const conditionalFilterEquals = (
  filterOne: ConditionalFilter,
  filterTwo: ConditionalFilter
): Boolean => {
  return (
    filterOne.filterType == filterTwo.filterType &&
    filterOne.operator == filterTwo.operator &&
    filterEquals(filterOne.condition1, filterTwo.condition1) &&
    filterEquals(filterOne.condition2, filterTwo.condition2)
  );
};

export default filterModelEquals;
