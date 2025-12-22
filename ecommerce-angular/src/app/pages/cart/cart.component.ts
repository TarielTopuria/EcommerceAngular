import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart-item.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: false
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice = 0;
  quantityForm: FormGroup = new FormGroup({});

  constructor(
    private readonly cartService: CartService,
    private readonly fb: FormBuilder,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((items) => {
        this.cartItems = items;
        this.syncQuantityForm(items);
        this.calculateTotalPrice();
      });
  }

  onQuantityChange(productId: number): void {
    const control = this.quantityForm.get(productId.toString()) as FormControl<number> | null;
    const quantity = Math.max(1, Number(control?.value) || 1);
    if (control && control.value !== quantity) {
      control.setValue(quantity, { emitEvent: false });
    }
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  getItemSubtotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  trackByProductId(index: number, item: CartItem): number {
    return item.product.id;
  }

  private calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  private syncQuantityForm(items: CartItem[]): void {
    if (!this.quantityForm || !(this.quantityForm instanceof FormGroup)) {
      this.quantityForm = this.fb.group({});
    }

    const desiredIds = new Set<string>();
    for (const item of items) {
      const id = item.product.id.toString();
      desiredIds.add(id);

      const existing = this.quantityForm.get(id) as FormControl<number> | null;
      if (!existing) {
        this.quantityForm.addControl(
          id,
          new FormControl(item.quantity, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(1)],
          })
        );
      } else if (existing.value !== item.quantity) {
        existing.setValue(item.quantity, { emitEvent: false });
      }
    }

    for (const key of Object.keys(this.quantityForm.controls)) {
      if (!desiredIds.has(key)) {
        this.quantityForm.removeControl(key);
      }
    }
  }
}
