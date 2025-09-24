import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
  standalone: false
})
export class SearchFilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(item =>
      item.name?.toLowerCase().includes(searchText)
    );
  }

}
