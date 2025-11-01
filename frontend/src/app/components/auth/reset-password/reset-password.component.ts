import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  @Input() panelMode = false; // when true, render compact content for tab panels
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);

  loading = false;
  submitted = false;
  token: string | null = null;
  error: string | null = null;
  success = false;
  showPassword = false;
  showConfirmPassword = false;

  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm: ['', [Validators.required]]
  });

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.error = 'Token inválido';
    }
  }

  getPasswordStrength(): string {
    const password = this.form.controls.password.value || '';
    let score = 0;
    
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'weak': return 'Débil';
      case 'medium': return 'Moderada';
      case 'strong': return 'Fuerte';
      default: return '';
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  submit() {
    this.error = null;
    this.submitted = true;
    this.form.markAllAsTouched();
    if (this.form.invalid || this.loading) return;

    const { password, confirm } = this.form.value;
    if (password !== confirm) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }
    if (!this.token) {
      this.error = 'Token inválido';
      return;
    }

    this.loading = true;
    this.auth.resetPassword(this.token, password!).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => this.router.navigateByUrl('/login'), 1200);
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'No se pudo restablecer la contraseña';
        this.loading = false;
      }
    });
  }
}
