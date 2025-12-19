import { Component, OnInit } from '@angular/core';
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

  constructor(private readonly cartService: CartService) {}

  ngOnInit(): void {
    this.refreshCart();
  }

  onQuantityChange(item: CartItem): void {
    const productId = item.product.id;
    const quantity = Math.max(1, Number(item.quantity) || 1);
    if (quantity !== item.quantity) {
      item.quantity = quantity;
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
    this.calculateTotalPrice();
  }
}
