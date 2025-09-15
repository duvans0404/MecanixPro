import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from './services/data.service';
import { SidebarComponent } from './components/navigation/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CommonModule, SidebarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css', '../styles.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'MecanixPro';
  stats: any = {};
  mobileMenuOpen = false;
  isDarkMode = false;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadStats();
    this.initializeTheme();
  }

  loadStats() {
    this.dataService.getTotalClientes().subscribe(total => this.stats.totalClientes = total);
    this.dataService.getTotalVehiculos().subscribe(total => this.stats.totalVehiculos = total);
    this.dataService.getOrdenesPendientes().subscribe(total => this.stats.ordenesPendientes = total);
    this.dataService.getOrdenesCompletadas().subscribe(total => this.stats.ordenesCompletadas = total);
    this.dataService.getTotalServicios().subscribe(total => this.stats.totalServicios = total);
    this.dataService.getTotalRepuestos().subscribe(total => this.stats.totalRepuestos = total);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  initializeTheme() {
    // Verificar si hay una preferencia guardada en localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      this.isDarkMode = prefersDark;
    }
    
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  applyTheme() {
    const htmlElement = document.documentElement;
    if (this.isDarkMode) {
      htmlElement.setAttribute('data-theme', 'dark');
    } else {
      htmlElement.removeAttribute('data-theme');
    }
  }
}