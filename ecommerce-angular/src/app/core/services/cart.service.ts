import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'cart_items';
  private cartItems: CartItem[] = [];

  constructor() {
    this.cartItems = this.loadFromStorage();
  }

  getCartItems(): CartItem[] {
    return this.cartItems.map((item) => ({ ...item }));
  }

  addToCart(product: Product): void {
    const index = this.cartItems.findIndex((ci) => ci.product.id === product.id);
    if (index >= 0) {
      this.cartItems[index] = {
        product: this.cartItems[index].product,
        quantity: this.cartItems[index].quantity + 1,
      };
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
    this.saveToStorage();
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter((ci) => ci.product.id !== productId);
    this.saveToStorage();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    const index = this.cartItems.findIndex((ci) => ci.product.id === productId);
    if (index >= 0) {
      this.cartItems[index] = {
        product: this.cartItems[index].product,
        quantity,
      };
      this.saveToStorage();
    }
  }

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) {
        return [];
      }
      const validItems: CartItem[] = parsed
        .filter((item: unknown) => {
          const i = item as Partial<CartItem>;
          return (
            !!i &&
            typeof i.quantity === 'number' &&
            i.quantity > 0 &&
            !!i.product &&
            typeof (i.product as Product).id === 'number'
          );
        })
        .map((i) => ({
          product: (i as CartItem).product,
          quantity: (i as CartItem).quantity,
        }));
      return validItems;
    } catch {
      return [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems));
    } catch {
    }
  }
}
