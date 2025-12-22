import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-add-product',
  standalone: false,
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
})
export class AddProductComponent implements OnInit {
  addProductForm: FormGroup;

  products: Product[] = [];
  isLoadingProducts = false;
  isSaving = false;

  message: string | null = null;
  error: string | null = null;

  private editingProductId: number | null = null;

  get isEditMode(): boolean {
    return this.editingProductId !== null;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly productService: ProductService
  ) {
    this.addProductForm = this.fb.group({
      title: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required]],
      image: ['', [Validators.required]],
      category: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  trackByProductId(_: number, product: Product): number {
    return product.id;
  }

  loadProducts(): void {
    this.isLoadingProducts = true;
    this.error = null;

    this.productService
      .getProducts()
      .pipe(finalize(() => (this.isLoadingProducts = false)))
      .subscribe({
        next: (products) => {
          this.products = products ?? [];
        },
        error: (err) => {
          console.error(err);
          this.error = 'Failed to load products.';
        },
      });
  }

  startEdit(product: Product): void {
    this.message = null;
    this.error = null;
    this.editingProductId = product.id;

    this.addProductForm.reset({
      title: product.title ?? '',
      price: product.price ?? 0,
      description: product.description ?? '',
      image: product.image ?? '',
      category: product.category ?? '',
    });
  }

  cancelEdit(): void {
    this.editingProductId = null;
    this.resetForm();
  }

  submit(): void {
    this.message = null;
    this.error = null;

    this.addProductForm.markAllAsTouched();
    if (this.addProductForm.invalid) return;

    const value = this.addProductForm.getRawValue() as {
      title: string;
      price: number;
      description: string;
      image: string;
      category: string;
    };

    const productPayload: Product = {
      id: this.editingProductId ?? 0,
      title: value.title,
      price: value.price,
      description: value.description,
      image: value.image,
      category: value.category,
    };

    this.isSaving = true;

    const request$ = this.isEditMode && this.editingProductId !== null
      ? this.productService.updateProduct(this.editingProductId, productPayload)
      : this.productService.addProduct(productPayload);

    request$
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.message = this.isEditMode ? 'Product updated.' : 'Product created.';
          this.cancelEdit();
          this.loadProducts();
        },
        error: (err) => {
          console.error(err);
          this.error = this.isEditMode ? 'Failed to update product.' : 'Failed to create product.';
        },
      });
  }

  deleteProduct(product: Product): void {
    this.message = null;
    this.error = null;

    const ok = window.confirm(`Delete "${product.title}"?`);
    if (!ok) return;

    this.isSaving = true;

    this.productService
      .deleteProduct(product.id)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          if (this.editingProductId === product.id) {
            this.cancelEdit();
          }
          this.message = 'Product deleted.';
          this.loadProducts();
        },
        error: (err) => {
          console.error(err);
          this.error = 'Failed to delete product.';
        },
      });
  }

  private resetForm(): void {
    this.addProductForm.reset({
      title: '',
      price: 0,
      description: '',
      image: '',
      category: '',
    });
  }
}