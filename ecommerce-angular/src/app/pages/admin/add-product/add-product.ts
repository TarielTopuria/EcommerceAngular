import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-add-product',
  standalone: false,
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.scss'],
})
export class AddProductComponent {
  addProductForm: FormGroup;

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

  submit(): void {
    this.addProductForm.markAllAsTouched();
    if (this.addProductForm.invalid) {
      return;
    }

    const value = this.addProductForm.getRawValue() as {
      title: string;
      price: number;
      description: string;
      image: string;
      category: string;
    };

    const product: Product = {
      id: 0,
      title: value.title,
      price: value.price,
      description: value.description,
      image: value.image,
      category: value.category,
    };

    this.productService.addProduct(product).subscribe({
      next: (created: Product) => {
        console.log('Product created:', created);
        this.addProductForm.reset({
          title: '',
          price: 0,
          description: '',
          image: '',
          category: '',
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
