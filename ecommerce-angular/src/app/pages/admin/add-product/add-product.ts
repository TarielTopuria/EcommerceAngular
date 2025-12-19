import { Component } from '@angular/core';
import { FormGroup, Validators, NonNullableFormBuilder } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CreateProduct, Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-add-product',
  standalone: false,
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.scss'],
})
export class AddProductComponent {
  addProductForm: FormGroup;

  isSubmitting = false;
  submitSucceeded = false;

  // Sample ID used for optional update/delete demo hooks
  private readonly sampleProductId: number = 1;

  constructor(
    private readonly fb: NonNullableFormBuilder,
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

  submit(): void {
    this.addProductForm.markAllAsTouched();
    if (this.addProductForm.invalid || this.isSubmitting) {
      return;
    }

    const value = this.addProductForm.getRawValue() as {
      title: string;
      price: number;
      description: string;
      image: string;
      category: string;
    };

    const payload: CreateProduct = {
      title: value.title,
      price: value.price,
      description: value.description,
      image: value.image,
      category: value.category,
    };

    this.isSubmitting = true;
    this.submitSucceeded = false;

    this.productService.addProduct(payload).subscribe({
      next: (created) => {
        console.log('Product created:', created);
        this.submitSucceeded = true;
        this.addProductForm.reset({
          title: '',
          price: 0,
          description: '',
          image: '',
          category: '',
        });
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Failed to create product:', err);
        this.isSubmitting = false;
      },
    });
  }

  // Optional UI hook: Demonstrate update product flow
  updateSampleProduct(): void {
    const updatedProduct: Product = {
      id: this.sampleProductId,
      title: 'Updated Title',
      price: 29.99,
      description: 'Updated description for demonstration.',
      image: 'https://via.placeholder.com/300x300.png?text=Updated',
      category: 'electronics',
    };

    this.productService.updateProduct(this.sampleProductId, updatedProduct).subscribe({
      next: (res: Product) => {
        console.log('Product updated:', res);
      },
      error: (err) => {
        console.error('Failed to update product:', err);
      },
    });
  }

  // Optional UI hook: Demonstrate delete product flow
  deleteSampleProduct(): void {
    const confirmed = window.confirm(`Delete product with ID ${this.sampleProductId}?`);
    if (!confirmed) {
      return;
    }

    this.productService.deleteProduct(this.sampleProductId).subscribe({
      next: () => {
        console.log('Product deleted successfully.');
      },
      error: (err) => {
        console.error('Failed to delete product:', err);
      },
    });
  }
}
