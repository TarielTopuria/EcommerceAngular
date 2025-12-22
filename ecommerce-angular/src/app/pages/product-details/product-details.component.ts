import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  standalone: false
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  inCart = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.product) {
          this.inCart = false;
          return;
        }
        this.inCart = this.cartService.isInCart(this.product.id);
      });

    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: ParamMap) => {
      const idParam = params.get('id');
      const id = idParam !== null ? Number(idParam) : NaN;
      if (!Number.isFinite(id) || id <= 0) {
        this.router.navigateByUrl('/');
        return;
      }

      this.productService
        .getProductById(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (product: Product) => {
            this.product = product;
            this.inCart = this.cartService.isInCart(product.id);
          },
          error: (err: unknown) => {
            console.error(err);
            this.product = null;
            this.inCart = false;
          }
        });
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.inCart = true;
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.inCart = false;
  }
}
