import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-auth-tabs',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginComponent, RegisterComponent],
  templateUrl: './auth-tabs.component.html',
  styleUrl: './auth-tabs.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AuthTabsComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  activeIndex = 0; // 0: login, 1: register

  ngOnInit(): void {
    // Decide initial tab based on current url (/login -> 0, /register -> 1)
    const url = this.router.url.toLowerCase();
    this.activeIndex = url.includes('/register') ? 1 : 0;
  }

  onTabChange(index: number) {
    this.activeIndex = index;
    if (index === 0) {
      this.router.navigate(['/login'], { queryParamsHandling: 'preserve' });
    } else {
      this.router.navigate(['/register'], { queryParamsHandling: 'preserve' });
    }
  }
}
