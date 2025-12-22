import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl: string = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/products/categories`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  addProduct(product: Product): Observable<Product> {
    const payload = {
      title: product.title,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category,
    };

    return this.http.post<Product>(`${this.apiUrl}/products`, payload);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    const payload: Product = { ...product, id };
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, payload);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }

  // Ticket 9: UI for update/delete is optional.
  // Example usage (call from any component):
  // this.productService.updateProduct(1, product).subscribe({ next: console.log, error: console.error });
  // this.productService.deleteProduct(1).subscribe({ next: () => console.log('deleted'), error: console.error });
}
