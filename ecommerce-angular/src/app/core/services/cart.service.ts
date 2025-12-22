import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'cart_items';
  private readonly cartItemsSubject: BehaviorSubject<CartItem[]>;
  readonly cartItems$: Observable<CartItem[]>;

  constructor() {
    const initial = this.loadFromStorage();
    this.cartItemsSubject = new BehaviorSubject<CartItem[]>(initial);
    this.cartItems$ = this.cartItemsSubject.asObservable();
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value.map((item) => ({ ...item }));
  }

  isInCart(productId: number): boolean {
    return this.cartItemsSubject.value.some((ci) => ci.product.id === productId);
  }

  addToCart(product: Product): void {
    const items = this.cartItemsSubject.value;
    const index = items.findIndex((ci) => ci.product.id === product.id);
    const next = items.slice();

    if (index >= 0) {
      next[index] = {
        product: next[index].product,
        quantity: next[index].quantity + 1,
      };
    } else {
      next.push({ product, quantity: 1 });
    }

    this.commit(next);
  }

  removeFromCart(productId: number): void {
    const next = this.cartItemsSubject.value.filter((ci) => ci.product.id !== productId);
    this.commit(next);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const items = this.cartItemsSubject.value;
    const index = items.findIndex((ci) => ci.product.id === productId);
    if (index < 0) return;

    const next = items.slice();
    next[index] = {
      product: next[index].product,
      quantity,
    };
    this.commit(next);
  }

  private commit(items: CartItem[]): void {
    const normalized = items
      .filter((ci) => !!ci && !!ci.product && typeof ci.product.id === 'number' && ci.quantity > 0)
      .map((ci) => ({ product: ci.product, quantity: ci.quantity }));

    this.cartItemsSubject.next(normalized);
    this.saveToStorage(normalized);
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

  private saveToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch {
    }
  }
}
