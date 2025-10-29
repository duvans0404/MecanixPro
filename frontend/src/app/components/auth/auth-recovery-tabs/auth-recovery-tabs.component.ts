import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

@Component({
  selector: 'app-auth-recovery-tabs',
  standalone: true,
  imports: [CommonModule, RouterModule, ForgotPasswordComponent, ResetPasswordComponent],
  templateUrl: './auth-recovery-tabs.component.html',
  // Reuse the same styles as the main auth tabs for visual consistency
  styleUrls: ['../auth-tabs/auth-tabs.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AuthRecoveryTabsComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  activeIndex = 0; // 0: forgot, 1: reset
  hasToken = false;

  ngOnInit(): void {
    this.recomputeState();
    // Recompute when navigating (e.g., switching tabs or url changes)
    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        this.recomputeState();
      }
    });
  }

  onTabChange(index: number) {
    // Block navigation to reset tab if no token
    if (index === 1 && !this.hasToken) {
      this.activeIndex = 0;
      this.router.navigate(['/forgot-password'], { queryParamsHandling: 'preserve' });
      return;
    }
    this.activeIndex = index;
    if (index === 0) {
      this.router.navigate(['/forgot-password'], { queryParamsHandling: 'preserve' });
    } else {
      this.router.navigate(['/reset-password'], { queryParamsHandling: 'preserve' });
    }
  }

  private recomputeState() {
    const url = this.router.url.toLowerCase();
    const qp = this.route.snapshot.queryParamMap;
    this.hasToken = !!qp.get('token');
    const wantsReset = url.includes('/reset-password');
    if (wantsReset && !this.hasToken) {
      // No token -> don't show reset, redirect to forgot
      this.activeIndex = 0;
      this.router.navigate(['/forgot-password']);
      return;
    }
    this.activeIndex = wantsReset ? 1 : 0;
  }
}
