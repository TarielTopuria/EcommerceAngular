import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart-item.model';

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
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.refreshCart();
  }

  onQuantityChange(productId: number): void {
    const control = this.quantityForm.get(productId.toString()) as FormControl<number> | null;
    const quantity = Math.max(1, Number(control?.value) || 1);
    if (control && control.value !== quantity) {
      control.setValue(quantity, { emitEvent: false });
    }
    this.cartService.updateQuantity(productId, quantity);
    this.refreshCart();
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
    this.refreshCart();
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

  private refreshCart(): void {
    this.cartItems = this.cartService.getCartItems();
    const controls: Record<string, FormControl<number>> = {};
    for (const item of this.cartItems) {
      controls[item.product.id.toString()] = new FormControl(item.quantity, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)],
      });
    }
    this.quantityForm = this.fb.group(controls);
    this.calculateTotalPrice();
  }
}
