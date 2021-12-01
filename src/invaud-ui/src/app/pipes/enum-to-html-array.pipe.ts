import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumToHtmlArray',
})
export class EnumToHtmlArrayPipe implements PipeTransform {
  transform(enumObjects: any, filterValues: string | string[] = undefined): string[] {
    if (enumObjects) {
      let enumKeys = Object.keys(enumObjects);

      if (Array.isArray(filterValues)) {
        return enumKeys.filter((key) => !filterValues.includes(key));
      } else {
        return enumKeys.filter((key) => {
          return key !== filterValues;
        });
      }
    } else {
      return null;
    }
  }
}
