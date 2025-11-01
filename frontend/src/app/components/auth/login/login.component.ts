import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error: string | null = null;
  submitted = false;
  showPassword = false;

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  fillCredentials(username: string, password: string) {
    this.form.patchValue({ username, password });
  }

  submit() {
    this.error = null;
    this.submitted = true;
    this.form.markAllAsTouched();
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    const { username, password } = this.form.value;
    
    this.auth.login(username!, password!).pipe(
      catchError(err => {
        console.error('Login error:', err);
        if (err.name === 'TimeoutError') {
          return throwError(() => ({ error: { message: 'El servidor no responde. Intenta de nuevo.' } }));
        }
        return throwError(() => err);
      })
    ).subscribe({
      next: () => {
        this.loading = false;
        const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err: any) => {
        console.error('Login error:', err);
        this.error = err?.error?.message || 'Error de autenticación';
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
