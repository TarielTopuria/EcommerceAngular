import { Component } from '@angular/core';
import { FormGroup, Validators, NonNullableFormBuilder } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CreateProduct } from '../../../core/models/product.model';

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
}
