import { Pipe, PipeTransform } from '@angular/core';

import { Product } from '../../core/models/product.model';

@Pipe({
  name: 'categoryFilter',
  standalone: false,
  pure: true
})
export class CategoryFilterPipe implements PipeTransform {
  transform(products: Product[] | null | undefined, category: string | null | undefined): Product[] {
    if (!products || products.length === 0) {
      return [];
    }

    if (!category || category === 'all') {
      return products;
    }

    return products.filter((product: Product) => product.category === category);
  }
}
