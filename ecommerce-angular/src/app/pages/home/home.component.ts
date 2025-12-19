import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private readonly productService: ProductService,
    private readonly router: Router
    // TODO: Inject CartService when available
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (err: unknown) => {
        // eslint-disable-next-line no-console
        console.error('Failed to load products', err);
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  goToProductDetails(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  addToCart(product: Product): void {
    // TODO: Replace with CartService.addToCart(product) when CartService is implemented
    // eslint-disable-next-line no-console
    console.log('Add to cart:', product);
  }
}
