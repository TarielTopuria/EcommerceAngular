import { Component, DestroyRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: string[] = [];
  selectedCategory = 'all';

  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.productService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products: Product[]) => {
          this.products = products;
          const set = new Set<string>();
          for (const p of products ?? []) {
            if (p?.category) set.add(p.category);
          }
          this.categories = Array.from(set).sort((a, b) => a.localeCompare(b));
          if (this.selectedCategory !== 'all' && !set.has(this.selectedCategory)) {
            this.selectedCategory = 'all';
          }
        },
        error: (err: unknown) => {
          console.error(err);
          this.products = [];
          this.categories = [];
          this.selectedCategory = 'all';
        }
      });
  }

  onCategorySelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCategory = selectElement.value;
  }

  goToProductDetails(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
