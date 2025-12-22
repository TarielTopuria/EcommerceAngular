import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, map, tap } from 'rxjs';

import { Product } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl: string = environment.apiUrl;
  private readonly useLocalFallback: boolean = this.apiUrl.includes('fakestoreapi.com');
  private readonly mutationsStorageKey = 'ecommerce.products.mutations.v1';

  private defaultMutations(): ProductMutations {
    return { created: [], updated: {}, deleted: [] };
  }

  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      map((remote) => (this.useLocalFallback ? this.applyMutationsToList(remote ?? []) : remote ?? []))
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/products/categories`);
  }

  getProductById(id: number): Observable<Product> {
    if (!this.useLocalFallback) {
      return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
    }

    const mutations = this.readMutations();
    if (mutations.deleted.includes(id)) {
      return throwError(() => new Error('Product was deleted locally.'));
    }

    const created = mutations.created.find((p) => p.id === id);
    if (created) {
      return of(created);
    }

    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
      map((remote) => mutations.updated[id] ?? remote)
    );
  }

  addProduct(product: Product): Observable<Product> {
    const payload = {
      title: product.title,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category,
    };

    return this.http.post<Product>(`${this.apiUrl}/products`, payload).pipe(
      map((response) => {
        if (!this.useLocalFallback) {
          return response;
        }

        const responseId = (response as Product | undefined)?.id;
        const id = typeof responseId === 'number' ? responseId : this.generateLocalId();
        const created: Product = {
          ...product,
          ...response,
          id,
        };

        this.persistCreated(created);
        return created;
      })
    );
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    const payload: Product = { ...product, id };
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, payload).pipe(
      map((response) => {
        const updated: Product = { ...payload, ...response, id };

        if (this.useLocalFallback) {
          this.persistUpdated(updated);
        }

        return updated;
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`).pipe(
      tap(() => {
        if (this.useLocalFallback) {
          this.persistDeleted(id);
        }
      })
    );
  }

  private applyMutationsToList(remote: Product[]): Product[] {
    const mutations = this.readMutations();
    const deleted = new Set<number>(mutations.deleted);

    const byId = new Map<number, Product>();

    for (const product of remote) {
      if (deleted.has(product.id)) continue;
      byId.set(product.id, mutations.updated[product.id] ?? product);
    }

    for (const product of mutations.created) {
      if (deleted.has(product.id)) continue;
      byId.set(product.id, product);
    }

    return Array.from(byId.values()).sort((a, b) => a.id - b.id);
  }

  private persistCreated(product: Product): void {
    const mutations = this.readMutations();

    mutations.deleted = mutations.deleted.filter((id) => id !== product.id);
    delete mutations.updated[product.id];

    const existingIndex = mutations.created.findIndex((p) => p.id === product.id);
    if (existingIndex >= 0) {
      mutations.created[existingIndex] = product;
    } else {
      mutations.created.push(product);
    }

    this.writeMutations(mutations);
  }

  private persistUpdated(product: Product): void {
    const mutations = this.readMutations();

    mutations.deleted = mutations.deleted.filter((id) => id !== product.id);

    const existingIndex = mutations.created.findIndex((p) => p.id === product.id);
    if (existingIndex >= 0) {
      mutations.created[existingIndex] = product;
    } else {
      mutations.updated[product.id] = product;
    }

    this.writeMutations(mutations);
  }

  private persistDeleted(id: number): void {
    const mutations = this.readMutations();

    if (!mutations.deleted.includes(id)) {
      mutations.deleted.push(id);
    }
    mutations.created = mutations.created.filter((p) => p.id !== id);
    delete mutations.updated[id];

    this.writeMutations(mutations);
  }

  private generateLocalId(): number {
    return Date.now();
  }

  private readMutations(): ProductMutations {
    if (typeof window === 'undefined' || !window.localStorage) {
      return this.defaultMutations();
    }

    try {
      const raw = window.localStorage.getItem(this.mutationsStorageKey);
      if (!raw) return this.defaultMutations();
      const parsed = JSON.parse(raw) as ProductMutations;

      return {
        created: Array.isArray(parsed.created) ? parsed.created : [],
        updated: parsed.updated && typeof parsed.updated === 'object' ? parsed.updated : {},
        deleted: Array.isArray(parsed.deleted) ? parsed.deleted : [],
      };
    } catch {
      return this.defaultMutations();
    }
  }

  private writeMutations(mutations: ProductMutations): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      window.localStorage.setItem(this.mutationsStorageKey, JSON.stringify(mutations));
    } catch {
      // ignore storage errors
    }
  }

  // Ticket 9: UI for update/delete is optional.
  // Example usage (call from any component):
  // this.productService.updateProduct(1, product).subscribe({ next: console.log, error: console.error });
  // this.productService.deleteProduct(1).subscribe({ next: () => console.log('deleted'), error: console.error });
}

type ProductMutations = {
  created: Product[];
  updated: Record<number, Product>;
  deleted: number[];
};
