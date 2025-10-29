import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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
      error: (err) => {
        this.error = err?.error?.message || 'No se pudo restablecer la contraseña';
        this.loading = false;
      }
    });
  }
}
