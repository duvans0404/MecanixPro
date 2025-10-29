import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { timeout, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error: string | null = null;
  submitted = false;

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['CLIENT', []],
    firstName: [''],
    lastName: ['']
  });

  submit() {
    this.error = null;
    this.submitted = true;
    this.form.markAllAsTouched();
    if (this.form.invalid || this.loading) return;
    this.loading = true;

    this.auth.register(this.form.value as any).pipe(
      timeout(10000), // 10 segundos de timeout
      catchError(err => {
        console.error('Register error:', err);
        if (err.name === 'TimeoutError') {
          return throwError(() => ({ error: { message: 'El servidor no responde. Intenta de nuevo.' } }));
        }
        return throwError(() => err);
      })
    ).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        console.error('Register error:', err);
        this.error = err?.error?.message || 'Error en el registro';
        this.loading = false;
      },
      complete: () => {
        // Asegurar que loading se resetee siempre
        if (this.loading) {
          this.loading = false;
        }
      }
    });
  }
}
