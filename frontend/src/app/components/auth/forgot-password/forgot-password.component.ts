import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  @Input() panelMode = false; // when true, render compact content for tab panels
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  loading = false;
  sent = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  submit() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    const { email } = this.form.value;
    this.auth.requestPasswordReset(email!).subscribe({
      next: (res) => {
        this.sent = true;
        this.loading = false;
        // En desarrollo, podríamos mostrar el res.resetUrl en consola
        if (res.resetUrl) console.log('Reset URL:', res.resetUrl);
      },
      error: () => {
        // Por privacidad respondemos igual
        this.sent = true;
        this.loading = false;
      }
    });
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}
