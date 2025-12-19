import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  standalone: false
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  private routeSub?: Subscription;
  private fetchSub?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productService: ProductService,
    private readonly cartService: CartService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      const idParam = params.get('id');
      const id = idParam !== null ? Number(idParam) : NaN;

      if (!Number.isFinite(id) || id <= 0) {
        console.error('Invalid product ID in route:', idParam);
        // Optionally redirect; here we go back to home
        this.router.navigate(['/']);
        return;
      }

      this.loadProduct(id);
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.fetchSub?.unsubscribe();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  isInCart(productId: number): boolean {
    return this.cartService.isInCart(productId);
  }

  private loadProduct(id: number): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.fetchSub = this.productService.getProductById(id).subscribe({
      next: (product: Product) => {
        this.product = product;
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error('Failed to load product:', err);
        this.errorMessage = 'Failed to load product. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
