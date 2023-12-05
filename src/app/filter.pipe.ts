import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    // filters the items based on the 'name' and 'company' properties
    // Thus searching for records who's name or company match the 'searchText' string
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText)
    );
  }
}
