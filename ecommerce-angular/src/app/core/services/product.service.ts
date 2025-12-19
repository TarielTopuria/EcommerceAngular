import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Product, CreateProduct } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl: string = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(`${this.apiUrl}/products`)
      .pipe(catchError(this.handleError('getProducts')));
  }

  getProductById(id: number): Observable<Product> {
    return this.http
      .get<Product>(`${this.apiUrl}/products/${id}`)
      .pipe(catchError(this.handleError('getProductById')));
  }

  addProduct(product: CreateProduct): Observable<Product> {
    return this.http
      .post<Product>(`${this.apiUrl}/products`, product)
      .pipe(catchError(this.handleError('addProduct')));
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http
      .put<Product>(`${this.apiUrl}/products/${id}`, product)
      .pipe(catchError(this.handleError('updateProduct')));
  }

  deleteProduct(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/products/${id}`)
      .pipe(catchError(this.handleError('deleteProduct')));
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse) => {
      console.error(`ProductService ${operation} failed:`, error);
      return throwError(() => error);
    };
  }
}
