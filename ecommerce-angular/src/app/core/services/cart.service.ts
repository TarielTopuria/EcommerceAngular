import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<Product[]>([]);
  readonly items$: Observable<Product[]> = this.itemsSubject.asObservable();

  addToCart(product: Product): void {
    const items = this.itemsSubject.getValue();
    const exists = items.some((p) => p.id === product.id);
    if (!exists) {
      this.itemsSubject.next([...items, product]);
    }
  }

  removeFromCart(productId: number): void {
    const items = this.itemsSubject.getValue();
    const nextItems = items.filter((p) => p.id !== productId);
    this.itemsSubject.next(nextItems);
  }

  isInCart(productId: number): boolean {
    return this.itemsSubject.getValue().some((p) => p.id === productId);
  }
}
