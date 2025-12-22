import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService, RegisterRequest } from '../../../core/services/auth.service';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value as string | null;
  const confirm = control.get('confirmPassword')?.value as string | null;
  if (!password || !confirm) return null;
  return password === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  readonly form;

  isSubmitting = false;
  message: string | null = null;
  error: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: ['', [Validators.required]],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        city: ['', [Validators.required]],
        street: ['', [Validators.required]],
        streetNumber: [1, [Validators.required, Validators.min(1)]],
        zipcode: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: [passwordsMatch] }
    );
  }

  submit(): void {
    this.message = null;
    this.error = null;

    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const v = this.form.getRawValue();

    const req: RegisterRequest = {
      email: v.email ?? '',
      username: v.username ?? '',
      password: v.password ?? '',
      name: {
        firstname: v.firstName ?? '',
        lastname: v.lastName ?? '',
      },
      address: {
        city: v.city ?? '',
        street: v.street ?? '',
        number: Number(v.streetNumber ?? 1),
        zipcode: v.zipcode ?? '',
      },
      phone: v.phone ?? '',
    };

    this.isSubmitting = true;
    this.authService
      .register(req)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.message = 'Account created. You can now log in.';
          this.form.reset({ streetNumber: 1 });
        },
        error: () => {
          this.error = 'Registration failed. Please try again.';
        },
      });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
